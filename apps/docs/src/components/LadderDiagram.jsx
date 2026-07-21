import React, { useState, useMemo, useEffect } from "react";
import {
  RotateCcw,
  Info,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  Zap,
  RefreshCw,
} from "lucide-react";
import clsx from "clsx";

// Types/Specs for standard demo circuits
const DEMO_CIRCUITS = {
  anb: {
    title: "Mạch ANB (AND Block - Nối tiếp hai khối)",
    description:
      "Kết nối tiếp một cụm mạch song song (Khối 1: X1 hoặc X2) với một cụm mạch song song khác (Khối 2: (X3 và X4) hoặc X5). Toàn bộ khối này nối tiếp với tiếp điểm điều kiện X0 để kích hoạt Y0.",
    data: {
      type: "series",
      children: [
        {
          type: "contact",
          kind: "NO",
          label: "X0",
          description: "Điều kiện kích hoạt chung (Start/Enable)",
        },
        {
          type: "parallel",
          label: "Khối 1 (OR)",
          children: [
            {
              type: "contact",
              kind: "NO",
              label: "X1",
              description: "Nhánh 1 - Khối 1",
            },
            {
              type: "contact",
              kind: "NO",
              label: "X2",
              description: "Nhánh 2 - Khối 1",
            },
          ],
        },
        {
          type: "parallel",
          label: "Khối 2 (AND/OR Block)",
          children: [
            {
              type: "series",
              children: [
                {
                  type: "contact",
                  kind: "NO",
                  label: "X3",
                  description: "Nhánh 1a - Khối 2",
                },
                {
                  type: "contact",
                  kind: "NO",
                  label: "X4",
                  description: "Nhánh 1b - Khối 2",
                },
              ],
            },
            {
              type: "contact",
              kind: "NO",
              label: "X5",
              description: "Nhánh 2 - Khối 2",
            },
          ],
        },
        {
          type: "coil",
          kind: "normal",
          label: "Y0",
          description: "Ngõ ra kết quả Y0",
        },
      ],
    },
  },
  orb: {
    title: "Mạch ORB (OR Block - Song song hai khối)",
    description:
      "Mắc song song hai khối nối tiếp với nhau. Khối 1 gồm X0 nối tiếp X1. Khối 2 gồm X2 nối tiếp X3. Chỉ cần một trong hai khối dẫn điện thì Y0 sẽ được kích hoạt.",
    data: {
      type: "series",
      children: [
        {
          type: "parallel",
          label: "Khối ORB",
          children: [
            {
              type: "series",
              children: [
                {
                  type: "contact",
                  kind: "NO",
                  label: "X0",
                  description: "Nhánh 1 - Điều kiện A",
                },
                {
                  type: "contact",
                  kind: "NO",
                  label: "X1",
                  description: "Nhánh 1 - Điều kiện B",
                },
              ],
            },
            {
              type: "series",
              children: [
                {
                  type: "contact",
                  kind: "NO",
                  label: "X2",
                  description: "Nhánh 2 - Điều kiện C",
                },
                {
                  type: "contact",
                  kind: "NO",
                  label: "X3",
                  description: "Nhánh 2 - Điều kiện D",
                },
              ],
            },
          ],
        },
        { type: "coil", kind: "normal", label: "Y0", description: "Ngõ ra Y0" },
      ],
    },
  },
  self_holding: {
    title: "Mạch Tự Giữ (Self-Holding Circuit)",
    description:
      "Mạch khởi động/dừng động cơ cơ bản. Nhấn nút Start (X0) kích hoạt Y0. Khi Y0 có điện, tiếp điểm thường mở Y0 khép lại để tự duy trì dòng điện kể cả khi nhả Start (X0). Nhấn nút Stop (X1 - thường đóng NC) để ngắt mạch.",
    data: {
      type: "series",
      children: [
        {
          type: "parallel",
          children: [
            {
              type: "contact",
              kind: "NO",
              label: "X0",
              description: "Nút nhấn Start (NO)",
            },
            {
              type: "contact",
              kind: "NO",
              label: "Y0",
              description: "Tiếp điểm tự giữ của ngõ ra Y0",
            },
          ],
        },
        {
          type: "contact",
          kind: "NC",
          label: "X1",
          description: "Nút nhấn Stop (NC - Thường đóng)",
        },
        {
          type: "coil",
          kind: "normal",
          label: "Y0",
          description: "Cuộn dây ngõ ra Y0 (Động cơ/Khởi động từ)",
        },
      ],
    },
  },
};

// Measure dimensions of nodes recursively
function measureNode(node) {
  if (
    node.type === "contact" ||
    node.type === "coil" ||
    node.type === "block"
  ) {
    return {
      ...node,
      width: node.type === "block" ? 130 : 90,
      height: 60,
    };
  }

  if (node.type === "series") {
    const children = node.children.map(measureNode);
    const spacing = 16;
    const width =
      children.reduce((sum, c) => sum + c.width, 0) +
      spacing * (children.length - 1);
    const height = Math.max(...children.map((c) => c.height), 60);
    return {
      ...node,
      width,
      height,
      children,
    };
  }

  if (node.type === "parallel") {
    const children = node.children.map(measureNode);
    const sidePadding = 24;
    const width = Math.max(...children.map((c) => c.width)) + sidePadding * 2;
    const spacing = 20;
    const height =
      children.reduce((sum, c) => sum + c.height, 0) +
      spacing * (children.length - 1);
    return {
      ...node,
      width,
      height,
      children,
    };
  }

  return node;
}

// Propagate evaluation logic (Power Flow)
function propagatePower(node, hasPowerIn, contactStates) {
  if (node.type === "contact") {
    // If Y is used as self-holding contact, its state is determined by its coil's state
    // Let's resolve the state check:
    const baseLabel = node.label;
    const isNC = node.kind === "NC" || node.kind === "falling";
    const contactOn = !!contactStates[baseLabel];
    const active = isNC ? !contactOn : contactOn;
    const hasPowerOut = hasPowerIn && active;

    return {
      ...node,
      hasPowerIn,
      hasPowerOut,
      active,
    };
  }

  if (node.type === "coil") {
    return {
      ...node,
      hasPowerIn,
      hasPowerOut: hasPowerIn,
      active: hasPowerIn,
    };
  }

  if (node.type === "block") {
    return {
      ...node,
      hasPowerIn,
      hasPowerOut: hasPowerIn,
      active: hasPowerIn,
    };
  }

  if (node.type === "series") {
    let currentPower = hasPowerIn;
    const children = [];
    for (const child of node.children) {
      const decoratedChild = propagatePower(child, currentPower, contactStates);
      children.push(decoratedChild);
      currentPower = decoratedChild.hasPowerOut;
    }
    return {
      ...node,
      hasPowerIn,
      hasPowerOut: currentPower,
      children,
    };
  }

  if (node.type === "parallel") {
    const children = [];
    let anyPowerOut = false;
    for (const child of node.children) {
      const decoratedChild = propagatePower(child, hasPowerIn, contactStates);
      children.push(decoratedChild);
      if (decoratedChild.hasPowerOut) {
        anyPowerOut = true;
      }
    }
    return {
      ...node,
      hasPowerIn,
      hasPowerOut: anyPowerOut,
      children,
    };
  }

  return node;
}

// Generate visual elements to draw in SVG
function generateSvgElements(node, cx, cy, elements) {
  const { type, hasPowerIn, hasPowerOut, active } = node;

  if (type === "contact") {
    const w = node.width;
    // Left and right connection wires
    elements.lines.push({
      x1: cx - w / 2,
      y1: cy,
      x2: cx - 8,
      y2: cy,
      hasPower: hasPowerIn,
    });
    elements.lines.push({
      x1: cx + 8,
      y1: cy,
      x2: cx + w / 2,
      y2: cy,
      hasPower: hasPowerOut,
    });

    elements.contacts.push({
      cx,
      cy,
      kind: node.kind,
      label: node.label,
      description: node.description,
      active,
      hasPowerIn,
      hasPowerOut,
      node,
    });
  } else if (type === "coil") {
    const w = node.width;
    elements.lines.push({
      x1: cx - w / 2,
      y1: cy,
      x2: cx - 12,
      y2: cy,
      hasPower: hasPowerIn,
    });
    elements.lines.push({
      x1: cx + 12,
      y1: cy,
      x2: cx + w / 2,
      y2: cy,
      hasPower: hasPowerOut,
    });

    elements.coils.push({
      cx,
      cy,
      kind: node.kind,
      label: node.label,
      description: node.description,
      active,
      hasPowerIn,
      hasPowerOut,
    });
  } else if (type === "block") {
    const w = node.width;
    elements.lines.push({
      x1: cx - w / 2,
      y1: cy,
      x2: cx - 45,
      y2: cy,
      hasPower: hasPowerIn,
    });
    elements.lines.push({
      x1: cx + 45,
      y1: cy,
      x2: cx + w / 2,
      y2: cy,
      hasPower: hasPowerOut,
    });

    elements.blocks.push({
      cx,
      cy,
      w: 90,
      h: 36,
      title: node.title,
      inputs: node.inputs,
      active,
      hasPowerIn,
      hasPowerOut,
    });
  } else if (type === "series") {
    let currentX = cx - node.width / 2;
    const spacing = 16;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const childCx = currentX + child.width / 2;
      generateSvgElements(child, childCx, cy, elements);

      if (i < node.children.length - 1) {
        elements.lines.push({
          x1: currentX + child.width,
          y1: cy,
          x2: currentX + child.width + spacing,
          y2: cy,
          hasPower: child.hasPowerOut,
        });
      }
      currentX += child.width + spacing;
    }
  } else if (type === "parallel") {
    const sidePadding = 24;
    const innerWidth = node.width - sidePadding * 2;

    let currentY = cy - node.height / 2;
    const spacing = 20;

    const branchCenterYs = [];

    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const childCy = currentY + child.height / 2;
      branchCenterYs.push(childCy);

      generateSvgElements(child, cx, childCy, elements);

      // Connect branch to left vertical line
      const childStartX = cx - child.width / 2;
      elements.lines.push({
        x1: cx - innerWidth / 2,
        y1: childCy,
        x2: childStartX,
        y2: childCy,
        hasPower: child.hasPowerIn,
      });

      // Connect branch to right vertical line
      const childEndX = cx + child.width / 2;
      elements.lines.push({
        x1: childEndX,
        y1: childCy,
        x2: cx + innerWidth / 2,
        y2: childCy,
        hasPower: child.hasPowerOut,
      });

      currentY += child.height + spacing;
    }

    // Draw left vertical rail
    elements.lines.push({
      x1: cx - innerWidth / 2,
      y1: branchCenterYs[0],
      x2: cx - innerWidth / 2,
      y2: branchCenterYs[branchCenterYs.length - 1],
      hasPower: node.hasPowerIn,
    });

    // Draw right vertical rail
    const anyActivePowerOut = node.children.some((child) => child.hasPowerOut);
    elements.lines.push({
      x1: cx + innerWidth / 2,
      y1: branchCenterYs[0],
      x2: cx + innerWidth / 2,
      y2: branchCenterYs[branchCenterYs.length - 1],
      hasPower: anyActivePowerOut,
    });

    // Draw entry line
    elements.lines.push({
      x1: cx - node.width / 2,
      y1: cy,
      x2: cx - innerWidth / 2,
      y2: cy,
      hasPower: node.hasPowerIn,
    });

    // Draw exit line
    elements.lines.push({
      x1: cx + innerWidth / 2,
      y1: cy,
      x2: cx + node.width / 2,
      y2: cy,
      hasPower: node.hasPowerOut,
    });

    if (node.label) {
      elements.texts.push({
        x: cx - node.width / 2 + 10,
        y: branchCenterYs[branchCenterYs.length - 1] + 16,
        text: node.label,
        type: "bracket-label",
      });
    }
  }
}

// Find all unique labels of contacts in the tree to build initial state
function getUniqueLabels(node, acc = new Set()) {
  if (!node) return acc;
  if (node.type === "contact") {
    acc.add(node.label);
  }
  if (node.children) {
    node.children.forEach((child) => getUniqueLabels(child, acc));
  }
  return acc;
}

export default function LadderDiagram({ data, title, description }) {
  // Option to switch demo circuits
  const [selectedDemo, setSelectedDemo] = useState(data ? "" : "anb");

  // Decide active circuit data
  const circuit = useMemo(() => {
    if (data) return { data, title, description };
    return DEMO_CIRCUITS[selectedDemo] || DEMO_CIRCUITS.anb;
  }, [data, title, description, selectedDemo]);

  // Extract unique labels
  const uniqueLabels = useMemo(() => {
    return Array.from(getUniqueLabels(circuit.data));
  }, [circuit]);

  // Initial state values for contacts
  const [contactStates, setContactStates] = useState({});

  // Reset/Initialize states when circuit changes
  useEffect(() => {
    const initial = {};
    uniqueLabels.forEach((label) => {
      // NC starts as false in state (i.e. not forced active), NO starts as false
      initial[label] = false;
    });
    setContactStates(initial);
    setSelectedContact(null);
  }, [circuit, uniqueLabels]);

  const [selectedContact, setSelectedContact] = useState(null);

  // Toggle helper
  const toggleContact = (label) => {
    setContactStates((prev) => {
      const nextState = !prev[label];
      // Self-holding logic hook: If Y0 coil goes active, Y0 contact triggers.
      // In this basic simulator, we can trigger Y0 state from coil status below
      return { ...prev, [label]: nextState };
    });
  };

  // Perform layout measurement
  const measuredTree = useMemo(() => {
    return measureNode(circuit.data);
  }, [circuit]);

  // Compute layout dimensions
  const paddingX = 40;
  const paddingY = 40;
  const totalWidth = measuredTree.width + paddingX * 2;
  const totalHeight = measuredTree.height + paddingY * 2;
  const centerY = totalHeight / 2;

  // Propagate evaluation (Power Flow)
  const evaluatedTree = useMemo(() => {
    // If coil Y0 is active, we also set Y0 contact state to true automatically (Self-holding simulation!)
    // To do this properly without loops, we do a multi-pass resolve for self-holding logic:
    let resolvedStates = { ...contactStates };

    // First pass evaluation
    let tempTree = propagatePower(measuredTree, true, resolvedStates);

    // If the coil matching a contact label is powered, we activate that contact
    // We check if Y0 (coil) is powered, then force Y0 contact = true (if not manually toggled off)
    let stateChanged = false;

    // Standard self-holding feedback look: 1 iteration is enough for simple circuits
    const coils = [];
    const findCoils = (n) => {
      if (n.type === "coil") coils.push(n);
      if (n.children) n.children.forEach(findCoils);
    };
    findCoils(tempTree);

    coils.forEach((coil) => {
      if (coil.active && !resolvedStates[coil.label]) {
        resolvedStates[coil.label] = true;
        stateChanged = true;
      }
    });

    if (stateChanged) {
      tempTree = propagatePower(measuredTree, true, resolvedStates);
    }

    return tempTree;
  }, [measuredTree, contactStates]);

  // Check if coil is active to reflect in self-holding states
  const outputCoilActive = useMemo(() => {
    const findActiveCoil = (node) => {
      if (node.type === "coil" && node.active) return true;
      if (node.children) {
        return node.children.some(findActiveCoil);
      }
      return false;
    };
    return findActiveCoil(evaluatedTree);
  }, [evaluatedTree]);

  // Generate SVG rendering shapes
  const svgElements = useMemo(() => {
    const elements = {
      lines: [],
      contacts: [],
      coils: [],
      blocks: [],
      texts: [],
    };

    // Draw main power rail line left to root node
    elements.lines.push({
      x1: 20,
      y1: centerY,
      x2: paddingX,
      y2: centerY,
      hasPower: true,
    });

    // Generate inner tree drawing
    generateSvgElements(
      evaluatedTree,
      paddingX + measuredTree.width / 2,
      centerY,
      elements,
    );

    // Draw right connection rail line from root node to right rail
    elements.lines.push({
      x1: totalWidth - paddingX,
      y1: centerY,
      x2: totalWidth - 20,
      y2: centerY,
      hasPower: evaluatedTree.hasPowerOut,
    });

    return elements;
  }, [evaluatedTree, measuredTree, centerY, totalWidth]);

  return (
    <div className="my-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 shadow-md overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/20">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Zap
              className={clsx(
                "w-5 h-5 transition-transform duration-500",
                outputCoilActive
                  ? "text-amber-500 scale-110 animate-pulse"
                  : "text-slate-400",
              )}
            />
            {circuit.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {circuit.description}
          </p>
        </div>

        {/* Demo Selector (only if not loaded with explicit props) */}
        {!data && (
          <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-800 p-1 rounded-lg self-start md:self-auto">
            {Object.keys(DEMO_CIRCUITS).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedDemo(key)}
                className={clsx(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all",
                  selectedDemo === key
                    ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200",
                )}
              >
                {key === "anb"
                  ? "Mạch ANB"
                  : key === "orb"
                    ? "Mạch ORB"
                    : "Tự Giữ"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Diagram Area */}
      <div className="p-6 flex flex-col lg:flex-row gap-6 items-stretch justify-between bg-slate-50/30 dark:bg-slate-950/5">
        {/* Interactive SVG Wrapper */}
        <div className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-950 rounded-lg p-4 border border-slate-100 dark:border-slate-800 flex items-center justify-center relative overflow-x-auto">
          <svg
            width={totalWidth}
            height={totalHeight}
            viewBox={`0 0 ${totalWidth} ${totalHeight}`}
            className="select-none mx-auto"
          >
            {/* Definitions for Glow Filters */}
            <defs>
              <filter
                id="glow-power"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter
                id="glow-coil"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Left and Right Main Bus Rails */}
            {/* Left Bus Rail (Power Rail - Live) */}
            <line
              x1={20}
              y1={10}
              x2={20}
              y2={totalHeight - 10}
              stroke="#10B981"
              strokeWidth={5}
              filter="url(#glow-power)"
              strokeLinecap="round"
            />
            {/* Right Bus Rail (Neutral Rail) */}
            <line
              x1={totalWidth - 20}
              y1={10}
              x2={totalWidth - 20}
              y2={totalHeight - 10}
              stroke="#94A3B8"
              strokeWidth={4}
              strokeLinecap="round"
            />

            {/* Draw Connecting Lines / Wires */}
            {svgElements.lines.map((line, idx) => (
              <line
                key={`line-${idx}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                className="transition-all duration-300"
                stroke={line.hasPower ? "#10B981" : "#94A3B8"}
                strokeWidth={line.hasPower ? 3.5 : 2}
                filter={line.hasPower ? "url(#glow-power)" : undefined}
                strokeLinecap="round"
              />
            ))}

            {/* Draw Contacts */}
            {svgElements.contacts.map((contact, idx) => {
              const isNC = contact.kind === "NC" || contact.kind === "falling";
              const isForced = contactStates[contact.label];

              // Contact status determines how we render the lines
              const conducts = contact.active;

              return (
                <g
                  key={`contact-${idx}`}
                  onClick={() => toggleContact(contact.label)}
                  onMouseEnter={() => setSelectedContact(contact)}
                  className="cursor-pointer group"
                >
                  {/* Invisible broad click target rectangle */}
                  <rect
                    x={contact.cx - 24}
                    y={contact.cy - 24}
                    width={48}
                    height={48}
                    fill="transparent"
                  />

                  {/* Left Contact Bar */}
                  <line
                    x1={contact.cx - 6}
                    y1={contact.cy - 16}
                    x2={contact.cx - 6}
                    y2={contact.cy + 16}
                    className="transition-all duration-300"
                    stroke={conducts ? "#10B981" : "#475569"}
                    strokeWidth={conducts ? 4.5 : 3}
                    filter={conducts ? "url(#glow-power)" : undefined}
                  />

                  {/* Right Contact Bar */}
                  <line
                    x1={contact.cx + 6}
                    y1={contact.cy - 16}
                    x2={contact.cx + 6}
                    y2={contact.cy + 16}
                    className="transition-all duration-300"
                    stroke={conducts ? "#10B981" : "#475569"}
                    strokeWidth={conducts ? 4.5 : 3}
                    filter={conducts ? "url(#glow-power)" : undefined}
                  />

                  {/* Diagonal slash for NC contact */}
                  {isNC && (
                    <line
                      x1={contact.cx - 10}
                      y1={contact.cy + 10}
                      x2={contact.cx + 10}
                      y2={contact.cy - 10}
                      className="transition-all duration-300"
                      stroke={conducts ? "#10B981" : "#E2E8F0"}
                      strokeWidth={3}
                      filter={conducts ? "url(#glow-power)" : undefined}
                    />
                  )}

                  {/* Rising Edge (P) Indicator */}
                  {contact.kind === "rising" && (
                    <text
                      x={contact.cx}
                      y={contact.cy + 4}
                      textAnchor="middle"
                      className="fill-slate-800 dark:fill-slate-100 font-bold text-[10px]"
                    >
                      P
                    </text>
                  )}

                  {/* Falling Edge (F) Indicator */}
                  {contact.kind === "falling" && (
                    <text
                      x={contact.cx}
                      y={contact.cy + 4}
                      textAnchor="middle"
                      className="fill-slate-800 dark:fill-slate-100 font-bold text-[10px]"
                    >
                      F
                    </text>
                  )}

                  {/* Contact Address Label */}
                  <text
                    x={contact.cx}
                    y={contact.cy - 20}
                    textAnchor="middle"
                    className={clsx(
                      "font-semibold text-xs transition-colors duration-300",
                      isForced
                        ? "fill-emerald-600 dark:fill-emerald-400 font-bold"
                        : "fill-slate-700 dark:fill-slate-300",
                    )}
                  >
                    {contact.label}
                  </text>

                  {/* Glow circle indicator when forced ON in state */}
                  <circle
                    cx={contact.cx}
                    cy={contact.cy - 30}
                    r={3}
                    className="transition-all duration-300"
                    fill={isForced ? "#10B981" : "transparent"}
                  />

                  {/* Subtle hover feedback box */}
                  <rect
                    x={contact.cx - 20}
                    y={contact.cy - 35}
                    width={40}
                    height={70}
                    rx={4}
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth={1.5}
                    strokeDasharray="2,2"
                    className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  />
                </g>
              );
            })}

            {/* Draw Coils */}
            {svgElements.coils.map((coil, idx) => {
              const active = coil.active;
              return (
                <g
                  key={`coil-${idx}`}
                  onMouseEnter={() =>
                    setSelectedContact({
                      label: coil.label,
                      description: coil.description || "Cuộn dây ngõ ra",
                      kind: "Coil",
                      active: coil.active,
                    })
                  }
                  className="group cursor-default"
                >
                  {/* Left Arc '(' */}
                  <path
                    d={`M ${coil.cx - 10},${coil.cy - 14} A 16,16 0 0,0 ${coil.cx - 10},${coil.cy + 14}`}
                    fill="none"
                    stroke={active ? "#10B981" : "#475569"}
                    strokeWidth={active ? 4.5 : 2.5}
                    className="transition-all duration-300"
                    filter={active ? "url(#glow-power)" : undefined}
                  />

                  {/* Right Arc ')' */}
                  <path
                    d={`M ${coil.cx + 10},${coil.cy - 14} A 16,16 0 0,1 ${coil.cx + 10},${coil.cy + 14}`}
                    fill="none"
                    stroke={active ? "#10B981" : "#475569"}
                    strokeWidth={active ? 4.5 : 2.5}
                    className="transition-all duration-300"
                    filter={active ? "url(#glow-power)" : undefined}
                  />

                  {/* Inner glow circle when active */}
                  {active && (
                    <circle
                      cx={coil.cx}
                      cy={coil.cy}
                      r={6}
                      fill="#10B981"
                      filter="url(#glow-coil)"
                      className="animate-pulse"
                    />
                  )}

                  {/* Coil Label */}
                  <text
                    x={coil.cx}
                    y={coil.cy - 20}
                    textAnchor="middle"
                    className={clsx(
                      "font-bold text-xs transition-colors duration-300",
                      active
                        ? "fill-emerald-500 dark:fill-emerald-400"
                        : "fill-slate-600 dark:fill-slate-400",
                    )}
                  >
                    {coil.label}
                  </text>
                </g>
              );
            })}

            {/* Draw Functional Blocks (e.g. MOV, ADD) */}
            {svgElements.blocks.map((block, idx) => {
              const active = block.active;
              return (
                <g key={`block-${idx}`} className="cursor-default">
                  {/* Outer Rectangle Box */}
                  <rect
                    x={block.cx - block.w / 2}
                    y={block.cy - block.h / 2}
                    width={block.w}
                    height={block.h}
                    rx={4}
                    fill={active ? "rgba(16, 185, 129, 0.05)" : "transparent"}
                    stroke={active ? "#10B981" : "#475569"}
                    strokeWidth={active ? 3 : 2}
                    className="transition-all duration-300"
                    filter={active ? "url(#glow-power)" : undefined}
                  />

                  {/* Instruction Name */}
                  <text
                    x={block.cx}
                    y={block.cy - 2}
                    textAnchor="middle"
                    className={clsx(
                      "font-bold text-xs",
                      active
                        ? "fill-emerald-500 dark:fill-emerald-400"
                        : "fill-slate-800 dark:fill-slate-200",
                    )}
                  >
                    {block.title}
                  </text>

                  {/* Instruction Inputs */}
                  <text
                    x={block.cx}
                    y={block.cy + 11}
                    textAnchor="middle"
                    className="fill-slate-500 dark:fill-slate-400 font-mono text-[9px]"
                  >
                    {block.inputs.join("  ")}
                  </text>
                </g>
              );
            })}

            {/* Render Other Texts/Labels */}
            {svgElements.texts.map((text, idx) => (
              <text
                key={`text-${idx}`}
                x={text.x}
                y={text.y}
                className="fill-slate-400 dark:fill-slate-500 font-mono text-[10px]"
              >
                {text.text}
              </text>
            ))}
          </svg>
        </div>

        {/* Side Panel: Controller & Inspector */}
        <div className="w-full lg:w-64 flex flex-col gap-4">
          {/* Controls Box */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-emerald-500" />
              Bảng Điều Khiển
            </h4>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nhấp trực tiếp vào tiếp điểm trong hình để kích hoạt hoặc sử dụng
              các phím gạt nhanh bên dưới:
            </p>

            <div className="flex flex-col gap-2 max-h-35 overflow-y-auto pr-1">
              {uniqueLabels.map((label) => (
                <div
                  key={label}
                  onClick={() => toggleContact(label)}
                  className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                    Tiếp điểm {label}
                  </span>
                  <button className="focus:outline-none">
                    {contactStates[label] ? (
                      <ToggleRight className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const initial = {};
                uniqueLabels.forEach((label) => {
                  initial[label] = false;
                });
                setContactStates(initial);
              }}
              className="mt-1 w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Tiếp Điểm
            </button>
          </div>

          {/* Inspector Box */}
          <div className="flex-1 border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-500" />
              Chi Tiết Tiếp Điểm
            </h4>

            {selectedContact ? (
              <div className="flex flex-col gap-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
                    {selectedContact.label}
                  </span>
                  <span
                    className={clsx(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      selectedContact.active
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
                    )}
                  >
                    {selectedContact.active
                      ? "ĐANG THÔNG MẠCH"
                      : "ĐANG NGẮT MẠCH"}
                  </span>
                </div>

                {selectedContact.kind && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Phân loại:{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {selectedContact.kind === "NO"
                        ? "Thường mở (NO)"
                        : selectedContact.kind === "NC"
                          ? "Thường đóng (NC)"
                          : selectedContact.kind}
                    </span>
                  </div>
                )}

                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800/80 leading-relaxed font-sans">
                  {selectedContact.description ||
                    "Không có chú giải cụ thể cho tiếp điểm này."}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <HelpCircle className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Rê chuột vào tiếp điểm hoặc cuộn dây để xem mô tả chi tiết tại
                  đây.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/10 flex flex-wrap gap-x-5 gap-y-2 justify-center text-[10px] text-slate-500 dark:text-slate-400 font-medium">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-1 bg-[#10B981] rounded"></div>
          <span>Dây dẫn có điện (ON)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-1 bg-[#94A3B8] rounded"></div>
          <span>Dây dẫn không có điện (OFF)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-4 border-l-2 border-r-2 border-emerald-500"></div>
          <span>Tiếp điểm NO đóng / NC mở</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span>Cuộn dây ngõ ra có điện</span>
        </div>
      </div>
    </div>
  );
}
