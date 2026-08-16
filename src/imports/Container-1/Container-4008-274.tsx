import imgImageSmartVideo from "./29468c4202ac56da70312fdaa7ff7844b56cec5f.png";

function Heading() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Noto_Sans_SC:500',sans-serif] font-medium leading-[20px] left-0 not-italic text-[14px] text-white top-0 whitespace-nowrap">Smart Video</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Noto_Sans_SC:500',sans-serif] font-medium leading-[16px] min-w-px not-italic relative text-[#9ca3af] text-[12px]">Transform videos into content</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="flex-[229_0_0] h-[38px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function ImageSmartVideo() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[64px]" data-name="Image (Smart Video)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImageSmartVideo} />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-[#2a2a2a] relative rounded-[14px] size-full" data-name="Container">
      <div className="content-stretch flex items-center overflow-clip p-[13px] relative rounded-[inherit] size-full">
        <Container1 />
        <ImageSmartVideo />
      </div>
      <div aria-hidden="true" className="absolute border border-[#dd6216] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}