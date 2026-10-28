// The brass ring of a key tag, behind the tag's frame (.sc-fob) and through its hole: what makes a round-topped photo
// read as a key tag and not as an arch. Place it first inside a relative box the size of the tag.
export function TagRing() {
  return (
    <span
      aria-hidden="true"
      className="absolute -top-[15%] left-1/2 block aspect-square w-[34%] -translate-x-1/2 rounded-full border-[3px] border-latao shadow-[0_2px_0_rgb(0_0_0/0.15)]"
    />
  );
}
