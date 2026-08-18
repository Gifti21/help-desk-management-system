export function WaveGraph() {
  return (
    <svg className="wave" viewBox="0 0 300 35" preserveAspectRatio="none">
      <path className="wave-line wave-1" d="M0,30 C15,10 30,50 45,30 C60,10 75,50 90,30 C105,10 120,50 135,30 C150,10 165,50 180,30 C195,10 210,50 225,30 C240,10 255,50 270,30 C285,10 300,50 300,30" />
      <path className="wave-line wave-2" d="M0,35 C15,15 30,55 45,35 C60,15 75,55 90,35 C105,15 120,55 135,35 C150,15 165,55 180,35 C195,15 210,55 225,35 C240,15 255,55 270,35 C285,15 300,55 300,35" />
    </svg>
  );
}
