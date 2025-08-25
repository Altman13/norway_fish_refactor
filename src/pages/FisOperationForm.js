import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Box,
  Button,
  Grid,
  Container,
  Typography,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TimerIcon from "@mui/icons-material/Timer";
import moment from "moment";

import Header from "./Header";
import Footer from "./Footer";
import FisOperationCard from "./FisOperationCard";

const API_URL = "http://192.168.3.1:8000/api/fis/current";

// 🔹 Хелпер для нормализации координат
const normalizePosition = (pos) =>
  pos
    ?.replaceAll("N", "+")
    .replaceAll("E", "+")
    .replaceAll("W", "-")
    .replaceAll("S", "-");

// 🔹 POST запрос
const postData = async (data, method = "POST") => {
  try {
    const response = await fetch(API_URL, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (err) {
    console.error("Request failed:", err);
  }
};

export default function FisOperationForm() {
  const [indexes, setIndexes] = useState([]);
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({ reValidateMode: "onBlur" });
  const { fields: fisOperations, append, remove } = useFieldArray({
    control,
    name: "fisOperations",
  });

  // 🔹 Начать новую операцию
  const startOperation = useCallback(() => {
    const startTime = new Date();
    const currentIndex =
      fisOperations.length === 0
        ? 0
        : (indexes[indexes.length - 1] || 0) + 1;

    const blockKey = `blockB${currentIndex}`;
    setIndexes((prev) => [...prev, currentIndex]);

    const pos = normalizePosition(localStorage.getItem("pos"));
    const newOperation = { startTimeFisOperation: startTime, blockBWithIndex: blockKey };

    localStorage.setItem(
      blockKey,
      JSON.stringify({ BDT: startTime, LTG: pos, blockBWithIndex: blockKey })
    );

    append(newOperation);
    postData({ blockBWithIndex: blockKey, BDT: startTime, LTG: pos });
  }, [fisOperations, indexes, append]);

  // 🔹 Завершить операцию
  const stopOperation = useCallback((e, blockKey) => {
    e.target.style.visibility = "hidden";

    const currentBlock = JSON.parse(localStorage.getItem(blockKey));
    if (!currentBlock || currentBlock.DU !== undefined) return;

    // меняем цвет карточки
    document
      .getElementsByClassName(`fis${blockKey}`)[0]
      ?.setAttribute("style", "background-color:crimson;");

    const pos = normalizePosition(localStorage.getItem("pos"));
    const now = moment().utc().format("YYYY-MM-DD[T]HH:mm:ss");

    const stopTime = now.replace(/[^\d]/g, " ").substring(0, now.length - 2);

    // скопируем loop1 данные из первой операции
    const baseBlock = JSON.parse(localStorage.getItem("blockB"));
    if (baseBlock) {
      Object.assign(currentBlock, {
        GE: baseBlock.GE,
        ZO: baseBlock.ZO,
        QI: baseBlock.QI,
        AC: baseBlock.AC,
        GS: baseBlock.GS,
        ME: baseBlock.ME,
        TF: baseBlock.TF,
      });
    }

    const duration = Math.floor(
      Math.abs(new Date() - new Date(currentBlock.BDT)) / 1000 / 60
    );

    Object.assign(currentBlock, {
      ZDT: stopTime,
      XTG: pos,
      CA: [],
      GP: 0,
      DU: duration,
      BDT: currentBlock.BDT.replace(/[-:T]/g, " ").slice(0, -8),
    });

    localStorage.setItem(blockKey, JSON.stringify(currentBlock));
    postData(currentBlock);
  }, []);

  // 🔹 Удалить операцию
  const deleteOperation = useCallback(
    (index) => {
      const blockKey = fisOperations[index]?.blockBWithIndex;
      if (!blockKey) return;

      localStorage.removeItem(blockKey);
      remove(index);
      postData(fisOperations[index], "DELETE");
    },
    [fisOperations, remove]
  );

  // 🔹 Загрузить операции при монтировании
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((operations) => {
        if (!operations?.length) return;

        operations.forEach((op) => {
          const blockKey = op.blockBWithIndex;
          localStorage.setItem(blockKey, JSON.stringify(op));

          const idx = parseInt(blockKey.replace(/\D/g, ""), 10) || 0;
          setIndexes((prev) => [...prev, idx]);

          append({ ...op, blockBWithIndex: blockKey });
        });
      });
  }, [append]);

  // 🔹 Смена страницы
  const routeChange = (e) => {
    switch (e.target.value) {
      case "loop1":
        navigate("/loop1");
        break;
      case "goToStartPage":
      default:
        navigate("/");
        break;
    }
  };

  return (
    <div className="App">
      <Header />
      <Container maxWidth="xl">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          component="form"
          onSubmit={handleSubmit(console.log)}
        >
          <Grid container spacing={3}>
            <Typography
              variant="h5"
              textAlign="center"
              sx={{ width: "100%", mt: 4, fontFamily: "cursive" }}
            >
              FISKEOPERASJON
            </Typography>

            <Grid item xs={12}>
              {fisOperations.map((op, index) => (
                <Grid
                  container
                  key={op.id}
                  spacing={1}
                  alignItems="center"
                  sx={{ mt: 1 }}
                >
                  <FisOperationCard index={op.blockBWithIndex} />
                  <Grid item xs={1}>
                    <Button
                      color="error"
                      onClick={() => deleteOperation(index)}
                    >
                      <DeleteForeverIcon fontSize="large" />
                    </Button>
                    {op?.DU === undefined && (
                      <Button
                        color="success"
                        id={`removeBtn${index}`}
                        onClick={(e) => stopOperation(e, op.blockBWithIndex)}
                      >
                        <TimerIcon fontSize="large" />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Grid item xs={6}>
              <Button
                variant="outlined"
                value="goToStartPage"
                fullWidth
                sx={{ border: "2px solid" }}
                onClick={routeChange}
              >
                TILBAKE
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                value="startOperation"
                color="error"
                fullWidth
                sx={{ border: "2px solid" }}
                onClick={startOperation}
              >
                START
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
