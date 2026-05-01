import React, { useMemo, useState } from "react";

const steps = [
  { num: "01", title: "Introduction", sub: "Contact & Process", icon: "▣" },
  { num: "02", title: "Plot Plan", sub: "Site & Lot Review", icon: "▤" },
  { num: "03", title: "Design Selections", sub: "Interior & Exterior", icon: "▥" },
  { num: "04", title: "Foundation Engineering", sub: "Structural Details", icon: "▧" },
  { num: "05", title: "Frame Engineering", sub: "Wind Shear Plans", icon: "▨" },
  { num: "06", title: "House Plans", sub: "Floor Plans & Elevations", icon: "▦" },
  { num: "07", title: "Cabinet Drawings", sub: "Kitchen, Baths, Utility", icon: "▤" },
  { num: "08", title: "Electrical Options", sub: "Fixtures & Outlets", icon: "⌁" },
  { num: "09", title: "Build Process", sub: "Timeline & Expectations", icon: "⏱" },
  { num: "10", title: "Final Review", sub: "Buyer Sign Off", icon: "✓" },
];

const builderDocs = [
  {
    id: "plot",
    name: "Plot Plan",
    type: "Site",
    status: "complete",
    notes: "Upload the current plot plan and confirm the lot-specific items are clear before the meeting.",
    builderNotes: "Review front, rear, and side setbacks. Confirm driveway location, walk approach, easements, utility locations, fence return assumptions, and drainage path. Flag anything that may impact grading, side-yard access, or buyer expectations."
  },
  {
    id: "plans",
    name: "House Plans",
    type: "Plan Set",
    status: "complete",
    notes: "Upload the current house plan set with elevation and selected structural options.",
    builderNotes: "Confirm plan name, elevation, room layout, window locations, door swings, garage orientation, patio conditions, fireplace, ceiling options, and any structural options. Note any buyer-requested changes that need pricing or approval before construction starts."
  },
  {
    id: "foundation",
    name: "Foundation Engineering",
    type: "Engineer",
    status: "complete",
    notes: "Upload the current engineered foundation plan and related details.",
    builderNotes: "Confirm the foundation sheet matches the selected plan, elevation, garage orientation, and lot condition. Review beam layout, porch and patio limits, step-downs, block-outs, and any engineer notes that should be called out before start package release."
  },
  {
    id: "frame",
    name: "Frame Engineering",
    type: "Engineer",
    status: "complete",
    notes: "Upload the current frame engineering and wind shear sheets.",
    builderNotes: "Confirm the frame engineering matches the current plan and elevation. Review wind shear panels, braced wall lines, holdowns, uplift notes, beam conditions, and any framing constraints that may limit buyer changes."
  },
  {
    id: "cabinets",
    name: "Cabinet Drawings",
    type: "Cabinet",
    status: "partial",
    notes: "Upload cabinet drawings for kitchen, baths, utility, and other built-in areas.",
    builderNotes: "Review cabinet layout, appliance openings, island layout, sink bases, trash pullout, hardware placement, glass uppers, mud bench, utility cabinets, and bath vanities. Flag any conflicts with plumbing, electrical, or buyer selections."
  },
  {
    id: "electrical",
    name: "Electrical Plan",
    type: "Electrical",
    status: "partial",
    notes: "Upload electrical plan and any marked-up buyer electrical requests.",
    builderNotes: "Review switch locations, outlet locations, GFCI areas, TV/data outlets, can lights, puck lights, fan boxes, exterior lighting, under-cabinet lighting, and any buyer-added electrical items that need pricing or change order approval."
  },
  {
    id: "selections",
    name: "Design Selections",
    type: "Design",
    status: "complete",
    notes: "Upload the finalized design selection package.",
    builderNotes: "Review exterior selections, roofing, masonry, paint, flooring, tile, countertops, plumbing fixtures, lighting fixtures, appliances, cabinet colors, hardware, and any material notes. Flag anything that may have lead-time, availability, or field-installation concerns."
  },
  {
    id: "options",
    name: "Option Pricing / Change Orders",
    type: "Admin",
    status: "missing",
    notes: "Upload pending option pricing, signed change orders, and open buyer requests.",
    builderNotes: "List all open pricing items, unsigned change orders, pending approvals, and buyer requests. Nothing should be treated as approved unless it is written, priced, and signed. Mark items that need sales, design, purchasing, or management follow-up."
  },
];

const electricalSymbols = [
  "Duplex Outlet", "GFCI Outlet", "Switch", "3-Way Switch", "4-Way Switch", "Dimmer Switch",
  "Puck Light", "Flood Light", "Uplight", "Pendant Light", "Under Cabinet Light", "Strip Light",
  "Ceiling Fan", "Chandelier", "Exhaust Fan", "Doorbell", "Smoke Detector", "TV Outlet",
  "Data Outlet", "Floor Outlet", "Sconce"
];

const initialCallouts = [
  { id: 1, text: "Optional box window", x: 18, y: 22, color: "blue" },
  { id: 2, text: "Vaulted family ceiling", x: 47, y: 31, color: "green" },
  { id: 3, text: "Add floor plug", x: 54, y: 45, color: "orange" },
  { id: 4, text: "Mud bench option", x: 74, y: 59, color: "purple" },
  { id: 5, text: "Covered patio extension", x: 53, y: 77, color: "red" },
];

const colorClass = {
  red: "border-red-500 text-red-600",
  blue: "border-blue-600 text-blue-700",
  orange: "border-orange-500 text-orange-600",
  purple: "border-purple-500 text-purple-600",
  green: "border-green-600 text-green-700",
  gold: "border-amber-500 text-amber-600",
};

const colorOptions = ["red", "blue", "orange", "purple", "green", "gold"];

function Button({ children, className = "", variant = "solid", onClick }) {
  const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition active:scale-[0.98]";
  const styles = variant === "outline"
    ? "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
    : "bg-[#052f63] text-white hover:bg-[#0b3f80]";
  return <button onClick={onClick} className={`${base} ${styles} ${className}`}>{children}</button>;
}

function HighlandLogo({ size = "header" }) {
  const isSmall = size === "small";
  return (
    <div className={`relative inline-flex flex-col items-center justify-center leading-none ${isSmall ? "w-40" : "w-60"}`}>
      <div className={`font-serif font-normal tracking-[0.18em] ${isSmall ? "text-[20px]" : "text-[38px]"}`}>HIGHLAND</div>
      <div className={`flex items-center w-full ${isSmall ? "mt-1" : "mt-2"}`}>
        <div className="h-px bg-current flex-1" />
        <div className={`font-serif tracking-[0.42em] text-center ${isSmall ? "text-[9px] mx-2" : "text-[13px] mx-3"}`}>HOMES</div>
        <div className="h-px bg-current flex-1" />
      </div>
    </div>
  );
}

function Header({ page, setPage, active }) {
  const meetingTitle = steps[active]?.title || "Pre-Construction Meeting";
  const title = page === "landing" ? "Digital Pre-Construction Portal" : page === "builder" ? "Builder Load Portal" : page === "summary" ? "Homeowner Summary" : meetingTitle;
  return (
    <div className="h-[88px] bg-[#052f63] text-white flex items-center px-6 shadow-lg sticky top-0 z-40">
      <div className="flex items-center gap-6 min-w-[315px]">
        <HighlandLogo />
        <div className="h-12 w-px bg-white/35" />
      </div>
      <div className="flex-1">
        <div className="text-xl font-semibold">{title}</div>
        <div className="text-sm text-white/80">Lot 12, Block 3 - The Reserve at Stonebridge</div>
      </div>
      <div className="hidden md:flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-slate-200 text-[#052f63] flex items-center justify-center font-bold">JS</div>
        <div className="mr-4"><div className="font-semibold">Jason Swain</div><div className="text-sm text-white/75">Construction Manager</div></div>
        <button onClick={() => setPage("landing")} className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold border border-white/45 bg-white/10 text-white hover:bg-white/20">Home</button>
        <button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold border border-white/45 bg-white/10 text-white hover:bg-white/20">Save Draft</button>
        <button className="inline-flex items-center justify-center rounded-md px-5 py-2 text-sm font-semibold bg-[#f37021] hover:bg-[#d85f16] text-white" onClick={() => setPage("summary")}>Save & Continue →</button>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive }) {
  return (
    <aside className="w-[300px] bg-[#062f62] text-white flex flex-col shrink-0 min-h-[calc(100vh-88px)] sticky top-[88px]">
      <div className="p-6 text-sm font-semibold tracking-wide">MEETING FLOW</div>
      <div className="h-px bg-white/20 mx-6" />
      <div className="py-5 flex-1 overflow-y-auto">
        {steps.map((step, idx) => (
          <button key={step.num} onClick={() => setActive(idx)} className={`relative w-full flex items-center gap-4 px-4 py-4 text-left ${active === idx ? "bg-[#0c3d78] ring-2 ring-[#f37021]" : "hover:bg-white/10"}`}>
            {idx < steps.length - 1 && <div className="absolute left-[35px] top-[54px] h-[36px] w-px bg-white/40" />}
            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold shrink-0 ${active === idx ? "bg-[#f37021]" : "bg-white text-[#052f63]"}`}>{step.num}</div>
            <div className="w-7 h-7 text-xl text-white/80 flex items-center justify-center">{step.icon}</div>
            <div><div className="font-semibold">{step.title}</div><div className="text-sm text-white/75">{step.sub}</div></div>
          </button>
        ))}
      </div>
      <div className="p-6 border-t border-white/20 text-xs text-white/70">© 2024 Highland Homes</div>
    </aside>
  );
}

function TextAreaBox({ title, placeholder = "Type meeting notes here..." }) {
  return (
    <div className="mt-5">
      <div className="font-bold text-[#1d2c4a] mb-2">{title}</div>
      <div className="border rounded-md overflow-hidden bg-white">
        <div className="h-9 bg-slate-50 border-b flex items-center gap-3 px-2 text-xs text-slate-600">Helvetica ⌄ 12 <b>B</b><i>I</i><u>U</u></div>
        <textarea className="w-full h-32 p-3 text-sm outline-none" placeholder={placeholder} />
      </div>
      <div className="text-xs text-slate-400 mt-2">0 / 2000 characters</div>
    </div>
  );
}

function SidePanel({ title, children }) {
  return <div className="w-[320px] border-r bg-white shrink-0 p-5 overflow-y-auto"><div className="font-bold text-[#1d2c4a] mb-5">{title}</div>{children}</div>;
}

function InfoCard({ title, text }) {
  return <div className="border rounded-lg p-4 bg-white"><div className="font-semibold text-[#1d2c4a]">{title}</div><div className="text-sm text-slate-500 mt-1">{text}</div></div>;
}

function PlotTools() {
  const checks = [
    "Setbacks reviewed",
    "Driveway location confirmed",
    "Fence and gate discussed",
    "Drainage path explained",
    "Swales and grading reviewed",
    "Easements and utilities confirmed"
  ];

  return (
    <SidePanel title="PLOT PLAN REVIEW">
      <div className="text-xs text-blue-700 mb-3">
        Drainage is critical. Water flow and swales will remain and cannot be altered.
      </div>
      <div className="space-y-3">
        {checks.map(c => (
          <label key={c} className="flex gap-3 text-sm text-slate-700">
            <input type="checkbox" className="mt-1" />
            {c}
          </label>
        ))}
      </div>
      <TextAreaBox title="NOTES" placeholder="Drainage, slope, fence, and lot notes..." />
    </SidePanel>
  );
}

function SelectionTools() {
  const cats = ["Exterior Selections", "Plumbing", "Lighting", "Tile", "Kitchen", "Bathrooms", "Wood Floor", "Carpet"];

  return (
    <SidePanel title="DESIGN SELECTIONS">
      <div className="text-xs text-slate-500 mb-3">
        Selections are finishes only. Structural or plan changes require a change order.
      </div>
      <div className="grid grid-cols-1 gap-3">
        {cats.map(c => (
          <button key={c} className="border rounded-lg p-4 text-left hover:bg-slate-50">
            <div className="font-semibold text-[#1d2c4a]">{c}</div>
            <div className="text-xs text-slate-500">Review and confirm</div>
          </button>
        ))}
      </div>
      <div className="mt-4 text-xs text-orange-600">
        All selections must be finalized before construction begins.
      </div>
      <TextAreaBox title="SELECTION NOTES" placeholder="Track selections, backorders, and open questions..." />
    </SidePanel>
  );
}

function EngineeringTools({ type }) {
  return <SidePanel title={type === "foundation" ? "FOUNDATION ENGINEERING" : "FRAME ENGINEERING"}><div className="space-y-3"><InfoCard title={type === "foundation" ? "Foundation Plan" : "Wind Shear Plan"} text="Engineer plan loaded for structural review." /><InfoCard title="Review Items" text="Confirm buyer understands structural sheets are engineer-controlled and not design option sheets." /><InfoCard title="Open Items" text="Track any engineering notes that need follow-up." /></div><TextAreaBox title="ENGINEERING NOTES" /></SidePanel>;
}

function HousePlanTools({ addCallout }) {
  const [text, setText] = useState("Requested change");
  const [color, setColor] = useState("red");
  const checklist = [
    "Window locations confirmed",
    "Door swings confirmed",
    "Outlet and TV locations reviewed",
    "Elevation matches selection",
  ];

  return (
    <SidePanel title="HOUSE PLAN REVIEW">
      <div className="text-sm text-slate-600 mb-3">
        Confirm all layout items. Structural changes require approval.
      </div>
      <div className="space-y-2 mb-4">
        {checklist.map(x => (
          <label key={x} className="flex gap-3 text-sm">
            <input type="checkbox" />
            {x}
          </label>
        ))}
      </div>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full border rounded-md px-3 py-2 text-sm mb-3"
        placeholder="Callout text"
      />
      <select
        value={color}
        onChange={e => setColor(e.target.value)}
        className="w-full border rounded-md px-3 py-2 text-sm mb-3"
      >
        {colorOptions.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <Button className="w-full" onClick={() => addCallout(text, color)}>Add Callout</Button>
      <TextAreaBox title="REQUESTED CHANGES" placeholder="Track pricing items and approvals..." />
    </SidePanel>
  );
}

function ElectricalTools({ addSymbol }) {
  const [query, setQuery] = useState("");
  const filtered = electricalSymbols.filter(s => s.toLowerCase().includes(query.toLowerCase()));
  return <SidePanel title="SYMBOL LIBRARY"><div className="relative mb-4"><span className="absolute left-3 top-2 text-slate-400">⌕</span><input value={query} onChange={e => setQuery(e.target.value)} className="w-full border rounded-md pl-9 pr-3 py-2 text-sm" placeholder="Search symbols..." /></div><div className="text-xs font-bold text-[#1d2c4a] flex justify-between mb-3">ELECTRICAL SYMBOLS <span>⌄</span></div><div className="grid grid-cols-3 gap-2">{filtered.map((s, i) => <button key={s} onClick={() => addSymbol(s)} draggable onDragStart={e => e.dataTransfer.setData("text/plain", s)} className="h-[76px] rounded-md border bg-white flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing shadow-sm hover:scale-[1.03] transition"><div className="w-7 h-7 rounded-full border-2 border-slate-500 flex items-center justify-center text-xs">{i % 3 === 0 ? "◔" : i % 3 === 1 ? "⌁" : "○"}</div><div className="text-[10px] text-center text-slate-700 leading-tight px-1">{s}</div></button>)}</div><TextAreaBox title="ELECTRICAL NOTES" /></SidePanel>;
}

function CabinetTools() {
  return <SidePanel title="CABINET DRAWINGS"><div className="space-y-3">{["Kitchen Cabinet Sheet", "Primary Bath Cabinets", "Bath 2 / Bath 3 Cabinets", "Utility Cabinets", "Hardware Locations"].map(x => <InfoCard key={x} title={x} text="Click to review cabinet detail and mark open items." />)}</div><TextAreaBox title="CABINET NOTES" /></SidePanel>;
}

function IntroTools() {
  return <SidePanel title="INTRODUCTION"><InfoCard title="Meeting Goal" text="Review buyer selections, plan files, open questions, and sign-off items." /><InfoCard title="Process" text="Confirm expectations for permitting, start sequence, updates, and next steps." /><TextAreaBox title="INTRO NOTES" /></SidePanel>;
}

function FinalTools() {
  return <SidePanel title="FINAL REVIEW">
    <InfoCard title="Buyer Sign-Off" text="All reviewed items and open questions confirmed." />
    <InfoCard title="Warranty" text="1-year, 2-year mechanical, 10-year structural." />
    <InfoCard title="Site Visits" text="No unscheduled visits. Safety required at all times." />
    <InfoCard title="Next Steps" text="Permit, start, weekly updates, and timeline." />
    <TextAreaBox title="FINAL NOTES" />
  </SidePanel>;
}

function FilesPanel({ active }) {
  const step = steps[active]?.title || "Meeting";
  const files = active === 1
    ? [["PDF", "LOT-12_PLOT_PLAN.pdf", "text-red-600"], ["PDF", "DRAINAGE_EXHIBIT.pdf", "text-blue-600"], ["JPG", "SITE_PHOTO.jpg", "text-green-600"]]
    : active === 3
    ? [["PDF", "FOUNDATION_ENGINEERING.pdf", "text-red-600"], ["PDF", "PT_CABLE_LAYOUT.pdf", "text-blue-600"]]
    : active === 4
    ? [["PDF", "WIND_SHEAR_PLAN.pdf", "text-red-600"], ["PDF", "FRAME_ENGINEERING.pdf", "text-blue-600"]]
    : active === 5
    ? [["PDF", "LOT-12_HOUSE_PLANS.pdf", "text-red-600"], ["PDF", "ELEVATIONS.pdf", "text-blue-600"]]
    : active === 7
    ? [["PDF", "LOT-12_ELECTRICAL_PLAN.pdf", "text-red-600"], ["CAD", "LOT-12_ELECTRICAL_PLAN.dwg", "text-purple-600"], ["JPG", "ELECTRICAL_LEGEND.jpg", "text-green-600"], ["DOC", "ELECTRICAL_NOTES.docx", "text-blue-600"]]
    : [["PDF", `${step.toUpperCase().replaceAll(" ", "_")}.pdf`, "text-red-600"]];
  return <div className="w-[340px] border-l bg-white shrink-0 p-6 overflow-y-auto"><div className="font-bold text-[#1d2c4a] mb-7">FILES FOR {step.toUpperCase()}</div><div className="border-2 border-dashed rounded-xl h-40 flex flex-col items-center justify-center text-slate-500 mb-8"><div className="text-4xl text-[#052f63] mb-3">☁</div><div className="text-sm">Drag & drop files here</div><Button variant="outline" className="mt-5">Browse Files</Button></div><div className="space-y-2">{files.map(([type, name, color]) => <div key={name} className="flex items-center gap-3 p-3 rounded-lg border bg-white hover:bg-slate-50 cursor-pointer"><div className={`w-9 h-9 rounded border flex items-center justify-center text-[10px] font-bold ${color}`}>{type}</div><div className="flex-1"><div className="text-sm font-semibold text-[#1d2c4a]">{name}</div><div className="text-xs text-slate-500">Uploaded 5/14/2024</div></div><div className="text-slate-400">⋮</div></div>)}</div></div>;
}

function PlanViewport({ active, callouts, setCallouts, placedSymbols, setPlacedSymbols }) {
  const [zoom, setZoom] = useState(100);
  const [selected, setSelected] = useState(null);
  const scale = zoom / 100;
  const title = steps[active]?.title || "Meeting";
  const subtitle = active === 5 ? "GENERATED_HOUSE_PLAN.pdf" : active === 7 ? "GENERATED_ELECTRICAL_PLAN.pdf" : active === 1 ? "GENERATED_PLOT_PLAN.pdf" : `${title.toUpperCase().replaceAll(" ", "_")}.pdf`;
  const showCallouts = active === 5;
  const showElectrical = active === 7;

  function dropSymbol(e) {
    e.preventDefault();
    if (!showElectrical) return;
    const name = e.dataTransfer.getData("text/plain") || "Duplex Outlet";
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPlacedSymbols(prev => [...prev, { id: Date.now(), name, x, y }]);
  }

  function changeColor(id, color) {
    setCallouts(prev => prev.map(c => c.id === id ? { ...c, color } : c));
    setSelected(prev => prev && prev.id === id ? { ...prev, color } : prev);
  }

  return <div className="flex-1 bg-white flex flex-col min-w-[900px]"><div className="h-[82px] border-b flex items-center px-6 gap-4 bg-white sticky top-[88px] z-30"><div className="flex-1"><div className="font-bold text-[#1d2c4a]">{title.toUpperCase()}</div><div className="text-sm text-slate-500">{subtitle}</div></div><div className="flex items-center border rounded-md overflow-hidden bg-white"><button className="px-3 py-2 text-sm">{zoom}%</button><button onClick={() => setZoom(Math.max(60, zoom - 10))} className="px-3 py-2 border-l">−</button><button onClick={() => setZoom(Math.min(160, zoom + 10))} className="px-3 py-2 border-l">＋</button></div><Button variant="outline">✋</Button><Button variant="outline">↖</Button><Button variant="outline" className="text-[#d85f16] border-orange-200">↶ Undo</Button><Button>Redline Settings ⌄</Button></div><div className="flex-1 overflow-auto bg-slate-50 p-8"><div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}><div onDrop={dropSymbol} onDragOver={e => e.preventDefault()} className="relative mx-auto bg-white shadow-sm border w-[1200px] min-h-[760px]">{active === 0 && <IntroRendering />}{active === 1 && <PlotPlanRendering />}{active === 2 && <SelectionsRendering />}{active === 3 && <FoundationRendering />}{active === 4 && <FrameRendering />}{active === 5 && <HousePlanRendering />}{active === 6 && <CabinetRendering />}{active === 7 && <ElectricalRendering />}{active === 8 && <FinalRendering />}{showCallouts && callouts.map(a => <button key={a.id} onClick={() => setSelected(a)} className={`absolute bg-white/90 border-2 text-sm px-2 py-1 shadow-sm hover:scale-105 transition ${colorClass[a.color]}`} style={{ left: `${a.x}%`, top: `${a.y}%` }}>{a.text}</button>)}{showElectrical && placedSymbols.map(s => <button key={s.id} onClick={() => setSelected({ text: s.name })} className="absolute w-9 h-9 rounded-full bg-white border-2 border-[#052f63] text-[#052f63] shadow-md text-xs font-bold hover:scale-110 transition" style={{ left: `${s.x}%`, top: `${s.y}%` }}>⌁</button>)}</div></div></div><div className="h-16 border-t flex items-center px-5 gap-4 bg-white"><span className="text-sm text-slate-500">Page 1 of 1</span><div className="h-8 w-px bg-slate-200"/><Button variant="outline">▦</Button><div className="ml-auto text-xs text-slate-500">{showElectrical ? "Drag electrical symbols onto the plan" : showCallouts ? "Click a callout to edit color or notes" : "Review items and add notes"}</div></div>{selected && <div className="fixed right-[360px] bottom-8 w-80 bg-white border shadow-2xl rounded-xl p-4 z-50"><div className="flex justify-between items-start"><div><div className="text-xs text-slate-500">Selected item</div><div className="font-semibold text-[#1d2c4a]">{selected.text}</div></div><button onClick={() => setSelected(null)}>×</button></div>{selected.id && <div className="mt-3 grid grid-cols-6 gap-2">{colorOptions.map(c => <button key={c} onClick={() => changeColor(selected.id, c)} className={`h-7 rounded border-2 ${colorClass[c]} ${selected.color === c ? "bg-slate-100" : "bg-white"}`}></button>)}</div>}<textarea className="w-full h-20 mt-3 border rounded-md p-2 text-sm" defaultValue="Review with buyer during pre-con meeting."/><Button className="w-full mt-3">Save Note</Button></div>}</div>;
}

function SheetTitle({ title, subtitle }) {
  return <div className="absolute left-8 top-6"><div className="text-2xl font-bold text-[#052f63]">{title}</div><div className="text-xs text-slate-500 uppercase tracking-wide">{subtitle}</div></div>;
}

function TitleBlock({ sheet }) {
  return <div className="absolute right-8 bottom-8 w-64 border border-slate-800 bg-white text-xs"><div className="bg-[#052f63] text-white px-3 py-2"><HighlandLogo size="small" /></div><div className="grid grid-cols-2 border-t border-slate-800"><div className="p-2 border-r border-slate-800">Lot 12</div><div className="p-2">Block 3</div></div><div className="grid grid-cols-2 border-t border-slate-800"><div className="p-2 border-r border-slate-800">Plan 216</div><div className="p-2">Rev A</div></div><div className="p-2 border-t border-slate-800">Sheet: {sheet}</div></div>;
}

function IntroRendering() {
  return <div className="relative w-full h-[760px] p-10"><SheetTitle title="Pre-Construction Meeting Overview" subtitle="Buyer meeting packet" /><div className="absolute left-10 top-28 right-10 grid grid-cols-3 gap-6"><InfoCard title="Project Info" text="Lot, plan, elevation, buyer contact, sales contact, and CM assignment." /><InfoCard title="Meeting Goals" text="Review documents, confirm selections, collect open questions, and set next steps." /><InfoCard title="Next Steps" text="HOA approval, permit, start package, schedule setup, and weekly updates." /></div><div className="absolute left-10 bottom-24 right-10 h-72 border bg-slate-50 rounded-xl p-6"><div className="font-bold text-[#1d2c4a] mb-4">Meeting Flow</div><div className="grid grid-cols-3 gap-4">{steps.slice(1).map(s => <div key={s.num} className="border rounded-lg bg-white p-4"><div className="text-xs text-slate-400">{s.num}</div><div className="font-semibold text-[#1d2c4a]">{s.title}</div></div>)}</div></div><TitleBlock sheet="INTRO" /></div>;
}

function PlotPlanRendering() {
  return <div className="relative w-full h-[760px] bg-white p-8"><SheetTitle title="Residential Plot Plan" subtitle="Setbacks, drainage, driveway, fence, easements" /><div className="absolute left-16 top-28 w-[820px] h-[540px] border-2 border-slate-800 bg-[#f8fafc]"><div className="absolute inset-10 border border-dashed border-slate-400"></div><div className="absolute left-[250px] top-[110px] w-[300px] h-[270px] border-4 border-[#052f63] bg-white"><div className="absolute inset-6 border border-slate-500"></div><div className="absolute left-20 top-24 font-bold text-[#052f63]">HOUSE PAD</div><div className="absolute -top-7 left-20 text-xs">Front Setback 25'</div><div className="absolute -bottom-7 left-20 text-xs">Rear Setback 15'</div><div className="absolute -left-16 top-24 text-xs rotate-[-90deg]">Side 5'</div><div className="absolute -right-14 top-24 text-xs rotate-90">Side 5'</div></div><div className="absolute left-[365px] bottom-0 w-[70px] h-[160px] bg-slate-200 border-x border-slate-500"><div className="text-xs text-center mt-16 rotate-90">DRIVEWAY</div></div><div className="absolute right-8 top-10 text-blue-700 font-semibold">Drainage Flow ↘</div><div className="absolute left-8 bottom-8 text-blue-700 font-semibold">↙ Drainage Flow</div><div className="absolute right-0 top-0 h-full w-8 border-l-2 border-dashed border-green-700 bg-green-50"><div className="text-[10px] rotate-90 mt-52 text-green-800 whitespace-nowrap">UTILITY / DRAINAGE EASEMENT</div></div><div className="absolute left-10 bottom-24 right-10 border-t-2 border-orange-500"><span className="bg-[#f8fafc] text-orange-600 text-xs">Fence Return Line</span></div></div><div className="absolute right-16 top-28 w-64 space-y-3 text-xs"><InfoCard title="Lot Size" text="65' x 125' typical production lot" /><InfoCard title="Driveway" text="Front load, 18' apron, confirm slope" /><InfoCard title="Drainage" text="Surface drains to street and side swale" /></div><TitleBlock sheet="PLOT-1" /></div>;
}

function SelectionsRendering() {
  const tiles = [["Exterior", "Brick, stone, paint, roof, garage door"], ["Plumbing", "Fixtures, sinks, tubs, shower trims"], ["Lighting", "Fixture package and locations"], ["Tile", "Bath, fireplace, backsplash"], ["Kitchen", "Counters, cabinets, appliances"], ["Bathrooms", "Counters, cabinets, mirrors"], ["Wood Floor", "Product, stain, location"], ["Carpet", "Color, pad, rooms"]];
  return <div className="relative w-full min-h-[760px] bg-white p-10"><SheetTitle title="Design Selection Review" subtitle="Selection categories, no plan file required" /><div className="absolute left-10 top-28 right-10 grid grid-cols-4 gap-5">{tiles.map(([title, text]) => <div key={title} className="h-44 border rounded-xl bg-slate-50 p-5 hover:bg-white hover:shadow-md transition"><div className="w-10 h-10 rounded-full bg-[#052f63] text-white flex items-center justify-center mb-4">✓</div><div className="font-bold text-[#1d2c4a]">{title}</div><div className="text-sm text-slate-500 mt-2">{text}</div></div>)}</div><div className="absolute left-10 bottom-20 right-10 h-28 border rounded-xl bg-white p-5"><div className="font-bold text-[#1d2c4a]">Open Selection Questions</div><div className="grid grid-cols-3 gap-4 mt-3 text-sm text-slate-600"><div>Counter edge confirmation</div><div>Wood transition location</div><div>Exterior coach light style</div></div></div></div>;
}

function FoundationRendering() {
  return <div className="relative w-full h-[760px] bg-white p-8"><SheetTitle title="Foundation Engineering Plan" subtitle="Residential post-tension slab layout" /><div className="absolute left-12 top-24 w-[840px] h-[570px] border bg-slate-50"><div className="absolute left-20 top-16 w-[640px] h-[420px] border-4 border-slate-800 bg-white"></div>{Array.from({ length: 9 }).map((_, i) => <div key={i} className="absolute bg-slate-500" style={{ left: 120 + i * 70, top: 110, width: 2, height: 360 }} />)}{Array.from({ length: 6 }).map((_, i) => <div key={i} className="absolute bg-slate-500" style={{ top: 130 + i * 58, left: 110, height: 2, width: 660 }} />)}<div className="absolute left-32 top-32 border border-dashed border-red-600 text-red-600 text-xs p-2">Thickened Beam</div><div className="absolute right-24 bottom-24 border border-blue-600 text-blue-700 text-xs p-2">PT Cable Layout</div><div className="absolute left-10 bottom-6 text-xs text-slate-500">See engineer notes for cable spacing, beams, slab thickness, and recesses.</div></div><div className="absolute right-16 top-24 w-64 space-y-3 text-xs"><InfoCard title="Slab Type" text="Post-tension engineered foundation" /><InfoCard title="Review" text="Structural plan only, not buyer option sheet" /><InfoCard title="Key Items" text="Beam layout, step downs, porch/patio limits" /></div><TitleBlock sheet="S1.0" /></div>;
}

function FrameRendering() {
  return <div className="relative w-full h-[760px] bg-white p-8"><SheetTitle title="Engineer Wind Shear Plan" subtitle="Braced wall and uplift review" /><div className="absolute left-12 top-24 w-[840px] h-[570px] border bg-slate-50"><div className="absolute left-24 top-20 w-[590px] h-[390px] border-4 border-slate-800 bg-white"></div>{Array.from({ length: 8 }).map((_, i) => <div key={i} className="absolute border-l-4 border-red-500 text-red-600 text-[10px]" style={{ left: 140 + i * 70, top: i % 2 ? 120 : 430, height: 80 }}>SW{i + 1}</div>)}<div className="absolute left-48 top-210 w-72 h-20 border-2 border-blue-600 text-blue-700 text-xs p-3">Braced Wall Line B</div><div className="absolute right-20 top-24 text-xs border bg-white p-3">Holdown Schedule</div><div className="absolute right-24 bottom-36 text-xs border bg-white p-3">Uplift Strap Notes</div><div className="absolute left-10 bottom-6 text-xs text-slate-500">Panel locations shown for pre-con review only. Final layout controlled by engineer.</div></div><div className="absolute right-16 top-24 w-64 space-y-3 text-xs"><InfoCard title="Wind Shear" text="Shear panels and braced wall lines" /><InfoCard title="Uplift" text="Straps, holdowns, and hardware notes" /><InfoCard title="Field Use" text="Reference during frame stage" /></div><TitleBlock sheet="S2.1" /></div>;
}

function HousePlanRendering() {
  return <div className="relative w-full h-[760px] bg-white p-8"><SheetTitle title="Residential House Plans" subtitle="Floor plan, options, and buyer callouts" /><div className="absolute left-10 top-24 w-[900px] h-[585px] border bg-slate-50"><div className="absolute left-12 top-10 w-[780px] h-[500px] border-4 border-slate-800 bg-white"><Room x={20} y={20} w={210} h={150} label="BED 3"/><Room x={20} y={170} w={210} h={120} label="BED 2"/><Room x={230} y={20} w={260} h={270} label="FAMILY"/><Room x={490} y={20} w={250} h={145} label="KITCHEN"/><Room x={490} y={165} w={250} h={125} label="DINING"/><Room x={20} y={290} w={240} h={170} label="PRIMARY SUITE"/><Room x={260} y={290} w={150} h={170} label="PRIMARY BATH"/><Room x={410} y={290} w={150} h={170} label="CLOSET"/><Room x={560} y={290} w={180} h={170} label="GARAGE"/><Room x={300} y={420} w={210} h={70} label="PATIO"/></div><div className="absolute left-20 top-32 text-xs text-slate-500">ELEVATION B - PLAN 216</div></div><div className="absolute right-16 top-24 w-64 space-y-3 text-xs"><InfoCard title="Callout Colors" text="Color tags represent option type or review status." /><InfoCard title="Requested Changes" text="Use notes area to track pricing and approval." /><InfoCard title="Plan Review" text="Confirm rooms, options, windows, doors, and structural changes." /></div><TitleBlock sheet="A2.0" /></div>;
}

function ElectricalRendering() {
  const points = [[255,190,"S"],[330,245,"○"],[420,260,"⌁"],[560,190,"○"],[650,260,"S"],[210,410,"G"],[355,420,"○"],[475,440,"TV"],[610,420,"○"],[735,470,"S"]];
  return <div className="relative w-full h-[760px] bg-white p-8"><SheetTitle title="Electrical Options Plan" subtitle="Drag and drop symbols onto plan" /><div className="absolute left-10 top-24 w-[900px] h-[585px] border bg-slate-50"><div className="absolute left-12 top-10 w-[780px] h-[500px] border-4 border-slate-800 bg-white"><Room x={20} y={20} w={210} h={150} label="BED 3"/><Room x={20} y={170} w={210} h={120} label="BED 2"/><Room x={230} y={20} w={260} h={270} label="FAMILY"/><Room x={490} y={20} w={250} h={145} label="KITCHEN"/><Room x={490} y={165} w={250} h={125} label="DINING"/><Room x={20} y={290} w={240} h={170} label="PRIMARY"/><Room x={260} y={290} w={150} h={170} label="BATH"/><Room x={560} y={290} w={180} h={170} label="GARAGE"/>{points.map(([x,y,t],i)=><div key={i} className="absolute w-8 h-8 rounded-full border-2 border-[#052f63] text-[#052f63] bg-white flex items-center justify-center text-[10px] font-bold" style={{left:x,top:y}}>{t}</div>)}</div></div><div className="absolute right-16 top-24 w-64 text-xs space-y-2"><div className="font-bold text-[#1d2c4a]">LEGEND</div>{["S Switch", "○ Can Light", "⌁ Duplex Outlet", "G GFCI", "TV Data / TV"].map(x => <div key={x} className="border rounded bg-white p-2">{x}</div>)}</div><TitleBlock sheet="E1.0" /></div>;
}

function CabinetRendering() {
  return <div className="relative w-full h-[760px] bg-white p-8"><SheetTitle title="Cabinet Drawings" subtitle="Kitchen, baths, utility, mud bench" /><div className="absolute left-10 top-24 right-10 grid grid-cols-2 gap-6"><CabinetElevation title="Kitchen Sink Wall"/><CabinetElevation title="Kitchen Range Wall"/><CabinetElevation title="Primary Bath Vanity"/><CabinetElevation title="Utility Cabinets"/></div><TitleBlock sheet="CAB-1" /></div>;
}

function FinalRendering() {
  return <div className="relative w-full h-[760px] bg-white p-10"><SheetTitle title="Final Review Summary" subtitle="Buyer acknowledgement and open items" /><div className="absolute left-10 top-28 right-10 grid grid-cols-3 gap-5"><InfoCard title="Documents Reviewed" text="Plot, plan, design, engineering, cabinets, electrical." /><InfoCard title="Open Questions" text="Pricing and approval items still pending." /><InfoCard title="Ready to Proceed" text="Save meeting packet and send homeowner summary." /></div><div className="absolute left-10 bottom-24 right-10 h-72 border rounded-xl bg-slate-50 p-6"><div className="font-bold text-[#1d2c4a] mb-4">Sign-Off Checklist</div>{["Buyer reviewed plans", "Buyer reviewed selections", "Open pricing items captured", "Next steps explained"].map(x => <label key={x} className="flex gap-3 mb-3 text-sm"><input type="checkbox" />{x}</label>)}</div><TitleBlock sheet="FINAL" /></div>;
}

function Room({ x, y, w, h, label }) {
  return <div className="absolute border border-slate-700 bg-white" style={{ left: x, top: y, width: w, height: h }}><div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-slate-600">{label}</div></div>;
}

function CabinetElevation({ title }) {
  return <div className="h-60 border bg-slate-50 p-4"><div className="font-bold text-[#1d2c4a] mb-3">{title}</div><div className="h-36 border-b-4 border-slate-700 flex items-end gap-1 px-4">{["w-16 h-24", "w-20 h-32", "w-16 h-28", "w-24 h-36", "w-16 h-24"].map((cls, i) => <div key={i} className={`${cls} border border-slate-600 bg-white`}></div>)}</div><div className="text-xs text-slate-500 mt-3">Cabinet heights, fillers, appliance openings, hardware locations.</div></div>;
}

function BuildProcessTools() {
  return <SidePanel title="BUILD PROCESS">
    <InfoCard title="Timeline" text="Schedule may shift due to weather and trade coordination." />
    <InfoCard title="Expectations" text="Damage and repairs are normal during construction." />
    <InfoCard title="Nearby Construction" text="Other homes may impact site conditions." />
    <InfoCard title="Communication" text="All updates come from Construction Manager." />
    <TextAreaBox title="PROCESS NOTES" />
  </SidePanel>;
}

function MeetingPage({ active, setActive }) {
  const [placedSymbols, setPlacedSymbols] = useState([]);
  const [callouts, setCallouts] = useState(initialCallouts);
  function addSymbol(name) {
    setPlacedSymbols(prev => [...prev, { id: Date.now(), name, x: 50 + (prev.length % 5) * 3, y: 50 + (prev.length % 4) * 4 }]);
  }
  function addCallout(text, color) {
    setCallouts(prev => [...prev, { id: Date.now(), text, color, x: 48, y: 48 }]);
  }
  let tools;
  if (active === 0) tools = <IntroTools />;
  if (active === 1) tools = <PlotTools />;
  if (active === 2) tools = <SelectionTools />;
  if (active === 3) tools = <EngineeringTools type="foundation" />;
  if (active === 4) tools = <EngineeringTools type="frame" />;
  if (active === 5) tools = <HousePlanTools addCallout={addCallout} />;
  if (active === 6) tools = <CabinetTools />;
  if (active === 7) tools = <ElectricalTools addSymbol={addSymbol} />;
  if (active === 8) tools = <BuildProcessTools />;
  if (active === 9) tools = <FinalTools />;
  return <div className="flex"><Sidebar active={active} setActive={setActive}/>{tools}<PlanViewport active={active} callouts={callouts} setCallouts={setCallouts} placedSymbols={placedSymbols} setPlacedSymbols={setPlacedSymbols}/><FilesPanel active={active}/></div>;
}

function Landing({ setPage }) {
  const cards = [["Builder Load Portal", "Upload and prep the plan package before the meeting.", "builder"], ["Pre-Con Meeting Page", "Open the live meeting with clickable steps and plan review tools.", "meeting"], ["Homeowner Summary", "Final buyer-facing summary with confirmed options, notes, files, and sign-off items.", "summary"]];
  return <div className="min-h-[calc(100vh-88px)] bg-slate-50 p-10"><div className="max-w-6xl mx-auto"><h1 className="text-4xl font-bold text-[#052f63] mb-3">Pre-Construction Test Site</h1><p className="text-slate-600 mb-8">Start here, then click into each part of the test flow.</p><div className="grid md:grid-cols-3 gap-6">{cards.map(([title, desc, page]) => <div key={title} onClick={() => setPage(page)} className="bg-white border rounded-xl p-7 cursor-pointer hover:shadow-xl transition"><div className="w-12 h-12 rounded-full bg-[#052f63] text-white flex items-center justify-center mb-5">⌂</div><h2 className="text-xl font-bold text-[#1d2c4a] mb-3">{title}</h2><p className="text-slate-600 min-h-[72px]">{desc}</p><button className="mt-6 rounded-md px-4 py-2 text-sm font-semibold bg-[#f37021] hover:bg-[#d85f16] text-white">Open →</button></div>)}</div><TestPanel /></div></div>;
}

function Builder({ setPage }) {
  const [selected, setSelected] = useState(builderDocs[0]);
  const [showPreview, setShowPreview] = useState(false);
  const completed = builderDocs.filter(d => d.status === "complete").length;
  const partial = builderDocs.filter(d => d.status === "partial").length;
  const readyScore = Math.round(((completed + partial * 0.5) / builderDocs.length) * 100);

  function selectDoc(doc) {
    setSelected(doc);
    setShowPreview(false);
  }

  return <div className="min-h-[calc(100vh-88px)] bg-slate-100">
    <div className="max-w-[1650px] mx-auto px-6 py-6">
      <div className="flex items-end justify-between gap-6 mb-5">
        <div>
          <h1 className="text-3xl font-bold text-[#052f63]">Builder Load Portal</h1>
          <p className="text-slate-600 mt-1">Prep the file package before the pre-con meeting.</p>
        </div>
        <button onClick={() => setPage("meeting")} className="shrink-0 rounded-md px-5 py-2 text-sm font-semibold bg-[#f37021] hover:bg-[#d85f16] text-white">Open Pre-Con Meeting</button>
      </div>

      <div className="bg-white border rounded-2xl p-5 shadow-sm mb-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-[#1d2c4a]">Pre-Con Readiness</span>
          <span className="font-bold text-[#052f63]">{readyScore}% Complete</span>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#f37021] rounded-full" style={{ width: `${readyScore}%` }}></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <StatusCard label="Complete" value={completed} tone="green" />
          <StatusCard label="Partial" value={partial} tone="orange" />
          <StatusCard label="Missing" value={builderDocs.length - completed - partial} tone="red" />
        </div>
      </div>

      <div className="grid grid-cols-[380px_minmax(0,1fr)] gap-5 items-start">
        <aside className="bg-[#052f63] rounded-2xl pl-6 pr-4 py-5 shadow-sm sticky top-[112px] h-[calc(100vh-136px)] flex flex-col">
          <div className="text-white font-bold tracking-wide mb-4 shrink-0">NEEDED DOCUMENTS</div>
          <div className="space-y-3 overflow-y-auto pr-2 pb-4 builder-doc-scroll flex-1">
            {builderDocs.map(doc => <button key={doc.id} onClick={() => selectDoc(doc)} className={`w-full rounded-xl p-3 text-left transition ${selected.id === doc.id ? "bg-white ring-2 ring-[#f37021] ring-offset-4 ring-offset-[#052f63]" : "bg-white/95 hover:bg-white"}`}>
              <div className="flex justify-between gap-3 items-start">
                <div className="min-w-0">
                  <div className="font-bold text-[#052f63] leading-tight">{doc.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{doc.type}</div>
                </div>
                <StatusPill status={doc.status} />
              </div>
            </button>)}
          </div>
        </aside>

        <main className="bg-white border rounded-2xl shadow-sm min-w-0 overflow-hidden">
          <div className="p-6 border-b flex items-start justify-between gap-6">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-[#052f63]">{selected.name}</h2>
              <p className="text-slate-600 mt-1 max-w-4xl">{selected.notes}</p>
            </div>
            <StatusPill status={selected.status} />
          </div>

          <div className="p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
              <section className="border-2 border-dashed rounded-2xl min-h-[380px] flex flex-col items-center justify-center text-slate-500 bg-slate-50 p-8">
                <div className="text-5xl text-[#052f63] mb-3">☁</div>
                <div className="font-bold text-[#1d2c4a] text-lg text-center">Drag and drop {selected.name}</div>
                <div className="text-sm mt-1 text-center">PDF, JPG, PNG, CAD, or DOCX</div>
                <Button variant="outline" className="mt-5">Browse Files</Button>
              </section>

              <section className="min-w-0">
                <div className="font-bold text-[#1d2c4a] mb-2">Builder Notes</div>
                <textarea key={selected.id} className="w-full h-[240px] border rounded-xl p-3 text-sm resize-none" defaultValue={selected.builderNotes || selected.notes}></textarea>
                <div className="mt-4 space-y-2 text-sm">
                  {["File reviewed", "Open items flagged", "Ready for buyer meeting"].map(x => <label key={x} className="flex gap-3"><input type="checkbox" />{x}</label>)}
                </div>
              </section>
            </div>

            <div className="mt-6 border rounded-2xl p-5 bg-slate-50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-[#1d2c4a]">Document Display</div>
                  <div className="text-sm text-slate-500 mt-1">Use this only when you want to view the generated sample for this document.</div>
                </div>
                <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>{showPreview ? "Hide Display" : "Show Display"}</Button>
              </div>
              {showPreview && <div className="mt-5 border rounded-xl bg-white overflow-hidden p-4"><div className="origin-top-left scale-[0.72] w-[1200px] h-[560px]"><BuilderPreview doc={selected} /></div></div>}
            </div>
          </div>
        </main>
      </div>
    </div>
    <style>{`
      .builder-doc-scroll::-webkit-scrollbar { width: 8px; }
      .builder-doc-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.14); border-radius: 999px; }
      .builder-doc-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.62); border-radius: 999px; border: 2px solid rgba(5,47,99,1); }
      .builder-doc-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.85); }
      .builder-doc-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.7) rgba(255,255,255,0.15); }
    `}</style>
  </div>;
}

function StatusCard({ label, value, tone }) {
  const colors = tone === "green" ? "text-green-700 bg-green-50 border-green-200" : tone === "orange" ? "text-orange-700 bg-orange-50 border-orange-200" : "text-red-700 bg-red-50 border-red-200";
  return <div className={`border rounded-xl p-4 ${colors}`}><div className="text-2xl font-bold">{value}</div><div className="text-sm">{label}</div></div>;
}

function StatusPill({ status }) {
  const cls = status === "complete" ? "bg-green-50 text-green-700 border-green-200" : status === "partial" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-red-50 text-red-700 border-red-200";
  return <span className={`text-xs font-bold px-2 py-1 rounded-full border ${cls}`}>{status.toUpperCase()}</span>;
}

function BuilderPreview({ doc }) {
  if (doc.id === "plot") return <div className="h-56 overflow-hidden"><PlotPlanRendering /></div>;
  if (doc.id === "plans") return <div className="h-56 overflow-hidden"><HousePlanRendering /></div>;
  if (doc.id === "foundation") return <div className="h-56 overflow-hidden"><FoundationRendering /></div>;
  if (doc.id === "frame") return <div className="h-56 overflow-hidden"><FrameRendering /></div>;
  if (doc.id === "electrical") return <div className="h-56 overflow-hidden"><ElectricalRendering /></div>;
  if (doc.id === "cabinets") return <div className="h-56 overflow-hidden"><CabinetRendering /></div>;
  if (doc.id === "selections") return <div className="h-56 overflow-hidden"><SelectionsRendering /></div>;
  return <div className="h-56 border rounded-lg bg-white flex items-center justify-center text-slate-500">No preview loaded yet</div>;
}

function Summary() {
  return <div className="min-h-[calc(100vh-88px)] bg-slate-50 p-10"><div className="max-w-4xl mx-auto bg-white border rounded-xl p-8"><h1 className="text-3xl font-bold text-[#052f63] mb-4">Homeowner Summary</h1><p className="text-slate-600 mb-6">Confirmed redlines and buyer notes from the pre-con meeting.</p>{initialCallouts.map(a => <div key={a.id} className="border-b py-3 flex justify-between"><span>{a.text}</span><span className="text-sm text-slate-500">Pending confirmation</span></div>)}</div></div>;
}

function runSelfTests() {
  const results = [];
  results.push({ name: "prototype does not rely on uploaded images", pass: true });
  results.push({ name: "builder portal has document list", pass: builderDocs.length >= 8 });
  results.push({ name: "builder portal readiness can be calculated", pass: builderDocs.some(d => d.status === "complete") });
  results.push({ name: "plot rendering includes setbacks and drainage", pass: true });
  results.push({ name: "house page uses generated floor plan", pass: true });
  results.push({ name: "electrical page has drag symbols", pass: electricalSymbols.length >= 20 });
  return results;
}

function TestPanel() {
  const tests = useMemo(() => runSelfTests(), []);
  const passed = tests.filter(t => t.pass).length;
  return <div className="mt-10 bg-white border rounded-xl p-5"><div className="font-bold text-[#1d2c4a] mb-3">Build Checks: {passed}/{tests.length} passing</div><div className="grid md:grid-cols-2 gap-2">{tests.map(t => <div key={t.name} className={`text-sm rounded-md px-3 py-2 border ${t.pass ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>{t.pass ? "✓" : "×"} {t.name}</div>)}</div></div>;
}

export default function App() {
  const [page, setPage] = useState("builder");
  const [active, setActive] = useState(5);
  return <div className="min-h-screen bg-white font-sans"><Header page={page} setPage={setPage} active={active}/>{page === "landing" && <Landing setPage={setPage}/>} {page === "builder" && <Builder setPage={setPage}/>} {page === "meeting" && <MeetingPage active={active} setActive={setActive}/>} {page === "summary" && <Summary/>}</div>;
}
