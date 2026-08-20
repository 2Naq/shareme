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
import RS2ChannelCard from "./RS2ChannelCard";
import RS2FormFields from "./RS2FormFields";
import RS2NotesCard from "./RS2NotesCard";
import RS2BitDetailTable from "./RS2BitDetailTable";
import {
  CHANNELS,
  BAUD_OPTIONS,
  STOP_BIT_OPTIONS,
  PARITY_OPTIONS,
  CONTROL_LINE_OPTIONS,
} from "./constants";

export default function RS2Tab() {
  const [selectedChannel, setSelectedChannel] = useState("ch0");
  const [dataLength, setDataLength] = useState("1");
  const [parity, setParity] = useState("00");
  const [stopBit, setStopBit] = useState("0");
  const [baud, setBaud] = useState("1000");
  const [header, setHeader] = useState("0");
  const [terminator, setTerminator] = useState("0");
  const [controlLine, setControlLine] = useState("111");
  const [sumCheck, setSumCheck] = useState("0");
  const [protocol, setProtocol] = useState("0");
  const [controlProcedure, setControlProcedure] = useState("0");
  const [hexInput, setHexInput] = useState("");
  const [hexError, setHexError] = useState("");

  const bitState = useMemo(
    () => ({
      dataLength,
      parity,
      stopBit,
      baud,
      header,
      terminator,
      controlLine,
      sumCheck,
      protocol,
      controlProcedure,
    }),
    [
      dataLength,
      parity,
      stopBit,
      baud,
      header,
      terminator,
      controlLine,
      sumCheck,
      protocol,
      controlProcedure,
    ],
  );

  const activeRegister = useMemo(() => {
    const ch = CHANNELS.find((c) => c.id === selectedChannel);
    return ch ? ch.register : "D8370";
  }, [selectedChannel]);

  const { binaryString, binaryFormatted, hexCode, ladderCommand } =
    useMemo(() => {
      // 16-bit breakdown for D8370, D8400, D8420:
      // b15: controlProcedure | b14: protocol | b13: sumCheck
      // b12..b10: controlLine (3 bits)
      // b9: terminator | b8: header
      // b7..b4: baud (4 bits)
      // b3: stopBit | b2..b1: parity (2 bits) | b0: dataLength
      const bin =
        controlProcedure +
        protocol +
        sumCheck +
        controlLine +
        terminator +
        header +
        baud +
        stopBit +
        parity +
        dataLength;

      const formatted = bin.replace(/(.{4})/g, "$1 ").trim();
      const decimal = parseInt(bin, 2);
      const hex = decimal.toString(16).toUpperCase().padStart(4, "0");
      return {
        binaryString: bin,
        binaryFormatted: formatted,
        hexCode: `H${hex}`,
        ladderCommand: `MOV H${hex} ${activeRegister}`,
      };
    }, [
      controlProcedure,
      protocol,
      sumCheck,
      controlLine,
      terminator,
      header,
      baud,
      stopBit,
      parity,
      dataLength,
      activeRegister,
    ]);

  // Tra ngược mã Hex → Bit states
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

    // Extract bit fields
    const newControlProcedure = bin.substring(0, 1); // b15
    const newProtocol = bin.substring(1, 2); // b14
    const newSumCheck = bin.substring(2, 3); // b13
    const newControlLine = bin.substring(3, 6); // b12..b10
    const newTerminator = bin.substring(6, 7); // b9
    const newHeader = bin.substring(7, 8); // b8
    const newBaud = bin.substring(8, 12); // b7..b4
    const newStopBit = bin.substring(12, 13); // b3
    const newParity = bin.substring(13, 15); // b2..b1
    const newDataLength = bin.substring(15, 16); // b0

    // Validate bit values
    const isValidBaud = BAUD_OPTIONS.some((o) => o.value === newBaud);
    const isValidStopBit = STOP_BIT_OPTIONS.some((o) => o.value === newStopBit);
    const isValidParity = PARITY_OPTIONS.some((o) => o.value === newParity);
    const isValidControlLine = CONTROL_LINE_OPTIONS.some(
      (o) => o.value === newControlLine,
    );

    if (
      !isValidBaud ||
      !isValidStopBit ||
      !isValidParity ||
      !isValidControlLine
    ) {
      setHexError("Mã Hex không hợp lệ (một số bit không khớp cấu hình RS2)");
      return;
    }

    setHexError("");
    setControlProcedure(newControlProcedure);
    setProtocol(newProtocol);
    setSumCheck(newSumCheck);
    setControlLine(newControlLine);
    setTerminator(newTerminator);
    setHeader(newHeader);
    setBaud(newBaud);
    setStopBit(newStopBit);
    setParity(newParity);
    setDataLength(newDataLength);
  }, []);

  return (
    <div className="space-y-6">
      <RS2ChannelCard
        selectedChannel={selectedChannel}
        onSelectChannel={setSelectedChannel}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-xl font-bold">
              <span>Communication setting for RS2 instruction</span>
            </CardTitle>
            <CardDescription>
              Cấu hình truyền thông cho lệnh RS2. Đang cấu hình cho thanh ghi{" "}
              <strong className="text-foreground font-mono font-bold">
                {activeRegister}
              </strong>{" "}
              ({CHANNELS.find((c) => c.id === selectedChannel)?.name}).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RS2FormFields
              dataLength={dataLength}
              setDataLength={setDataLength}
              parity={parity}
              setParity={setParity}
              stopBit={stopBit}
              setStopBit={setStopBit}
              baud={baud}
              setBaud={setBaud}
              header={header}
              setHeader={setHeader}
              terminator={terminator}
              setTerminator={setTerminator}
              controlLine={controlLine}
              setControlLine={setControlLine}
              sumCheck={sumCheck}
              setSumCheck={setSumCheck}
              protocol={protocol}
              setProtocol={setProtocol}
              controlProcedure={controlProcedure}
              setControlProcedure={setControlProcedure}
            />

            <RS2NotesCard />
          </CardContent>
        </Card>

        <div>
          <ResultPanel
            binaryFormatted={binaryFormatted}
            hexCode={hexCode}
            ladderCommand={ladderCommand}
            hexInput={hexInput}
            hexError={hexError}
            onHexInput={handleHexInput}
            register={activeRegister}
            onHexFocus={() => setHexInput(hexCode)}
            onHexBlur={() => setHexInput("")}
          />
        </div>
      </div>

      <BitMapTable binaryString={binaryString} />

      <RS2BitDetailTable activeRegister={activeRegister} bitState={bitState} />
      <span>
        Tài liệu tham khảo FX SERIES USER'S MANUAL - Data Communication Edition
        (JY997D16901R) [page 636]
      </span>
    </div>
  );
}
