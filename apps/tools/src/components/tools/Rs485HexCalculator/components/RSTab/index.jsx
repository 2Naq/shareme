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
import RSFormFields from "./RSFormFields";
import RSBitDetailTable from "./RSBitDetailTable";
import {
  BAUD_OPTIONS,
  STOP_BIT_OPTIONS,
  PARITY_OPTIONS,
  CONTROL_LINE_NO_PROTOCOL,
  CONTROL_LINE_COMPUTER_LINK,
} from "./constants";

export default function RSTab() {
  const [dataLength, setDataLength] = useState("1");
  const [parity, setParity] = useState("00");
  const [stopBit, setStopBit] = useState("0");
  const [baud, setBaud] = useState("1000");
  const [header, setHeader] = useState("0");
  const [terminator, setTerminator] = useState("0");
  const [controlLine, setControlLine] = useState("011");
  const [sumCheck, setSumCheck] = useState("0");
  const [protocol, setProtocol] = useState("0");
  const [transmissionControl, setTransmissionControl] = useState("0");
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
      transmissionControl,
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
      transmissionControl,
    ],
  );

  // Khi đổi protocol, reset controlLine về giá trị hợp lệ đầu tiên
  const handleProtocolChange = useCallback(
    (val) => {
      setProtocol(val);
      if (val === "1") {
        // Computer link: chỉ cho phép 000, 010
        if (controlLine !== "000" && controlLine !== "010") {
          setControlLine("000");
        }
      }
    },
    [controlLine],
  );

  const controlLineOptions =
    protocol === "1" ? CONTROL_LINE_COMPUTER_LINK : CONTROL_LINE_NO_PROTOCOL;

  const { binaryString, binaryFormatted, hexCode, ladderCommand } =
    useMemo(() => {
      // Bit layout FX3U (MSB → LSB):
      // b15: transmissionControl | b14: protocol | b13: sumCheck
      // b12 b11 b10: controlLine (3 bits)
      // b9: terminator | b8: header
      // b7 b6 b5 b4: baud (4 bits)
      // b3: stopBit | b2 b1: parity | b0: dataLength
      const bin =
        transmissionControl +
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
        ladderCommand: `MOV H${hex} D8120`,
      };
    }, [
      transmissionControl,
      protocol,
      sumCheck,
      controlLine,
      terminator,
      header,
      baud,
      stopBit,
      parity,
      dataLength,
    ]);

  // Reverse-map hex → bit fields
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

    // Parse bit fields
    const newTransmission = bin.substring(0, 1); // b15
    const newProtocol = bin.substring(1, 2); // b14
    const newSumCheck = bin.substring(2, 3); // b13
    const newControlLine = bin.substring(3, 6); // b12-b10
    const newTerminator = bin.substring(6, 7); // b9
    const newHeader = bin.substring(7, 8); // b8
    const newBaud = bin.substring(8, 12); // b7-b4
    const newStopBit = bin.substring(12, 13); // b3
    const newParity = bin.substring(13, 15); // b2-b1
    const newDataLength = bin.substring(15, 16); // b0

    // Validate
    const isValidBaud = BAUD_OPTIONS.some((o) => o.value === newBaud);
    const isValidStopBit = STOP_BIT_OPTIONS.some((o) => o.value === newStopBit);
    const isValidParity = PARITY_OPTIONS.some((o) => o.value === newParity);

    if (!isValidBaud || !isValidStopBit || !isValidParity) {
      setHexError("Mã Hex không hợp lệ (một số bit không khớp cấu hình)");
      return;
    }

    setHexError("");
    setTransmissionControl(newTransmission);
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle>Communication setting for RS instruction</CardTitle>
            <CardDescription>
              Cấu hình truyền thông cho lệnh RS. Thanh ghi <strong>D8120</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RSFormFields
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
              protocol={protocol}
              handleProtocolChange={handleProtocolChange}
              controlLine={controlLine}
              setControlLine={setControlLine}
              controlLineOptions={controlLineOptions}
              sumCheck={sumCheck}
              setSumCheck={setSumCheck}
              transmissionControl={transmissionControl}
              setTransmissionControl={setTransmissionControl}
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

      <RSBitDetailTable bitState={bitState} />

      <span className="text-muted-foreground block text-xs">
        Tài liệu tham khảo FX SERIES USER'S MANUAL - Data Communication Edition
        (JY997D16901R) [page 634]
      </span>
    </div>
  );
}
