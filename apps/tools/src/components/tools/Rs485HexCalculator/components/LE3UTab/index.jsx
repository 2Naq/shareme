import React, { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import BitMapTable from "../BitMapTable";
import ResultPanel from "../ResultPanel";
import LE3UFormFields from "./LE3UFormFields";
import LE3UBitDetailTable from "./LE3UBitDetailTable";
import {
  PROTOCOL_OPTIONS,
  BAUD_OPTIONS,
  STOP_BIT_OPTIONS,
  PARITY_OPTIONS,
  DATA_LENGTH_OPTIONS,
} from "./constants";

export default function LE3UTab() {
  const [protocol, setProtocol] = useState("1000");
  const [baud, setBaud] = useState("1000");
  const [stopBit, setStopBit] = useState("0");
  const [parity, setParity] = useState("00");
  const [dataLength, setDataLength] = useState("1");
  const [hexInput, setHexInput] = useState("");
  const [hexError, setHexError] = useState("");

  const bitState = useMemo(
    () => ({
      dataLength,
      parity,
      stopBit,
      baud,
      protocol,
    }),
    [dataLength, parity, stopBit, baud, protocol],
  );

  const { binaryString, binaryFormatted, hexCode, ladderCommand } =
    useMemo(() => {
      const reserved = "0000";
      const bin = protocol + reserved + baud + stopBit + parity + dataLength;
      const formatted = bin.replace(/(.{4})/g, "$1 ").trim();
      const decimal = parseInt(bin, 2);
      const hex = decimal.toString(16).toUpperCase().padStart(4, "0");
      return {
        binaryString: bin,
        binaryFormatted: formatted,
        hexCode: `H${hex}`,
        ladderCommand: `MOV H${hex} D8120`,
      };
    }, [protocol, baud, stopBit, parity, dataLength]);

  // Reverse-map: nhập mã Hex → parse binary → set lại tất cả Select
  const handleHexInput = useCallback((rawValue) => {
    const cleaned = rawValue.replace(/^(0x|H)/i, "").trim();
    setHexInput(rawValue);

    if (cleaned === "") {
      setHexError("");
      return;
    }

    if (!/^[0-9A-Fa-f]{1,4}$/.test(cleaned)) {
      setHexError("Nhập tối đa 4 ký tự Hex (0-9, A-F)");
      return;
    }

    const decimal = parseInt(cleaned, 16);
    const bin = decimal.toString(2).padStart(16, "0");

    // Bit layout: [15-12: protocol] [11-8: reserved] [7-4: baud] [3: stopBit] [2-1: parity] [0: dataLength]
    const newProtocol = bin.substring(0, 4);
    const newBaud = bin.substring(8, 12);
    const newStopBit = bin.substring(12, 13);
    const newParity = bin.substring(13, 15);
    const newDataLength = bin.substring(15, 16);

    const isValidProtocol = PROTOCOL_OPTIONS.some(
      (o) => o.value === newProtocol,
    );
    const isValidBaud = BAUD_OPTIONS.some((o) => o.value === newBaud);
    const isValidStopBit = STOP_BIT_OPTIONS.some((o) => o.value === newStopBit);
    const isValidParity = PARITY_OPTIONS.some((o) => o.value === newParity);
    const isValidDataLength = DATA_LENGTH_OPTIONS.some(
      (o) => o.value === newDataLength,
    );

    if (
      !isValidProtocol ||
      !isValidBaud ||
      !isValidStopBit ||
      !isValidParity ||
      !isValidDataLength
    ) {
      setHexError("Mã Hex không hợp lệ (một số bit không khớp cấu hình)");
      return;
    }

    setHexError("");
    setProtocol(newProtocol);
    setBaud(newBaud);
    setStopBit(newStopBit);
    setParity(newParity);
    setDataLength(newDataLength);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle>Thông số truyền thông — FX3U / LE3U</CardTitle>
            <CardDescription>
              Lựa chọn các thông số để cấu hình kết nối RS485. Thanh ghi{" "}
              <strong>D8120</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LE3UFormFields
              dataLength={dataLength}
              setDataLength={setDataLength}
              parity={parity}
              setParity={setParity}
              stopBit={stopBit}
              setStopBit={setStopBit}
              baud={baud}
              setBaud={setBaud}
              protocol={protocol}
              setProtocol={setProtocol}
            />
          </CardContent>
        </Card>

        <ResultPanel
          binaryFormatted={binaryFormatted}
          hexCode={hexCode}
          ladderCommand={ladderCommand}
          hexInput={hexInput}
          hexError={hexError}
          onHexInput={handleHexInput}
          register="D8120"
          onHexFocus={() => {
            if (!hexInput) setHexInput(hexCode);
          }}
          onHexBlur={() => {
            if (hexInput === hexCode) setHexInput("");
          }}
        />
      </div>

      <BitMapTable binaryString={binaryString} />

      <LE3UBitDetailTable bitState={bitState} />
    </div>
  );
}
