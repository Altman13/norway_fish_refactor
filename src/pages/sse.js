import postStatusesMsg from './postStatuses';

const ICONS = {
  OK: '/static/illustrations/icons/OK.svg',
  NAK: '/static/illustrations/icons/NG.svg',
  WAIT: '/static/illustrations/icons/Warning.svg',
  SEND_WAIT: '/static/illustrations/icons/Waiting.svg',
  GREY: '/static/illustrations/icons/Grey.svg'
};

const events = new EventSource(`http://192.168.3.1:8000/sse`);

const getLastMessageIndex = (allMessages) => {
  if (!allMessages?.lastMessage) return null;
  return Object.keys(allMessages.lastMessage).find(key => key !== 'src');
};

const updateMessageStatus = (messageKey, icon, allMessages) => {
  const lastCode = document.querySelector(`#lastCode > img`);
  const lastCodeMsg = document.querySelector(`#lastCodeMsg`);

  if (!messageKey || !allMessages || !lastCode) return;

  allMessages[messageKey].src = icon;
  lastCode.src = icon;
  if (lastCodeMsg) lastCodeMsg.innerHTML = messageKey;

  localStorage.setItem('allStatusesSendingMessages', JSON.stringify(allMessages));
};

const unblockMessagesIfExpired = () => {
  const blockMsgState = JSON.parse(localStorage.getItem('blockMsgState'));
  if (!blockMsgState) return;

  const elapsedMinutes = (Date.now() - blockMsgState.dateTime) / 1000 / 60;
  if (elapsedMinutes >= 5) {
    localStorage.removeItem('blockMsgState');
    console.log('Blocking msg set off');
  }
};

const handleAckDelete = (parsedData) => {
  if (parsedData.data?.RS === 'ACK' && parsedData.data?.RE !== '522') {
    Object.keys(localStorage)
      .filter(key => key.includes('blockB'))
      .forEach(key => {
        const currentBlock = JSON.parse(localStorage.getItem(key));
        if (currentBlock?.isReady) localStorage.removeItem(key);
      });

    fetch('http://192.168.3.1:8000/api/fis/current', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }})
      .then(res => res.json())
      .then(data => console.log('Deleted data:', data));
  }
};

events.onerror = (error) => console.error('SSE Error:', error);

events.onmessage = (event) => {
  console.log('SSE Event:', event);

  unblockMessagesIfExpired();

  const parsedData = JSON.parse(event.data);
  const allMessages = JSON.parse(localStorage.getItem('allStatusesSendingMessages')) || {};
  const lastMessageIndex = getLastMessageIndex(allMessages);

  handleAckDelete(parsedData);

  // RET events
  if (parsedData?.TM === 'RET') {
    localStorage.removeItem('blockMsgState');

    if (parsedData?.data?.RS) {
      let icon = ICONS.WAIT;

      if (parsedData.data.RS === 'ACK') {
        icon = parsedData.data.RE === '522' ? ICONS.GREY : ICONS.OK;
      } else if (parsedData.data.RS === 'NAK') {
        icon = ICONS.NAK;
      }

      updateMessageStatus(lastMessageIndex, icon, allMessages);

      if (!localStorage.getItem('ret')) postStatusesMsg(allMessages);
      localStorage.setItem('ret', true);
    }
  }

  // STATUS events
  if (parsedData?.STATUS) {
    localStorage.removeItem('ret');
    let icon = ICONS.WAIT;

    if (['202 FD', '202 LO'].includes(parsedData.STATUS)) icon = ICONS.WAIT;
    if (parsedData.STATUS === '202 STM32') icon = ICONS.SEND_WAIT;

    updateMessageStatus(lastMessageIndex, icon, allMessages);
  }

  // TIMEPOSSTAMP and DATIPOS events
  const setPosDate = (posData) => {
    if (!posData?.pos || !posData?.date) return;
    const mainPos = document.getElementById('main_pos');
    const mainDate = document.getElementById('main_date');
    if (mainPos) mainPos.textContent = posData.pos;
    if (mainDate) mainDate.textContent = posData.date;
    localStorage.setItem('pos', posData.pos);
    localStorage.setItem('datetime', posData.date);
  };

  if (parsedData?.TIMEPOSSTAMP) setPosDate(parsedData.TIMEPOSSTAMP);
  if (parsedData?.DATIPOS) setPosDate(parsedData.DATIPOS);
};
