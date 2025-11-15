// Sales Trend Line Chart
const salesData = [12000, 25000, 34000, 30000, 36000, 42000, 44000];
const svg = document.getElementById("salesChart");
const w = 320, h = 160;
const maxVal = Math.max(...salesData, 50000);
const coords = salesData.map((v, i) => {
  const x = 20 + (i * (w - 40) / 6);
  const y = h - 24 - ((v / maxVal) * (h - 50));
  return [x, y];
});
let polyline = "M";
coords.forEach(([x, y], i) => { polyline += `${x} ${y} `; });
svg.innerHTML = `
  <rect x="0" y="0" width="${w}" height="${h}" fill="#f3fdf5"/>
  <polyline fill="none" stroke="#34be5b" stroke-width="3" points="${coords.map(xy=>xy.join(",")).join(" ")}"/>
  ${coords.map(([x, y])=>`<circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="#34be5b" stroke-width="2"/>`).join("")}
  <g font-size="11" fill="#888">
    <text x="20" y="${h-8}">Oct 20</text>
    <text x="${w/6*1 + 20}" y="${h-8}">Oct 21</text>
    <text x="${w/6*2 + 20}" y="${h-8}">Oct 22</text>
    <text x="${w/6*3 + 20}" y="${h-8}">Oct 23</text>
    <text x="${w/6*4 + 20}" y="${h-8}">Oct 24</text>
    <text x="${w/6*5 + 20}" y="${h-8}">Oct 26</text>
    <text x="${w/6*6 + 20}" y="${h-8}">Oct 28</text>
  </g>
  <g font-size="12" fill="#bbb">
    <text x="4" y="${h-24}">0</text>
    <text x="0" y="45">50,000</text>
  </g>
`;
window.addEventListener('DOMContentLoaded', async () => {
  const role = auth.getRole();
  if (role !== 'vendor') {
    alert('Unauthorized');
    return (window.location.href = '../index.html');
  }

  document.getElementById('logoutBtn')?.addEventListener('click', auth.logout);

  try {
    const reqs = await auth.fetchJSON('/vendor-requests/vendor');
    console.log('Requests for you:', reqs);
  } catch (err) {
    console.error(err);
  }
});

// Simple Pie Chart for Medicine Category Sales
const pie = document.getElementById("categoryPie");
const data = [33, 33, 34];
const colors = ["#98f7bb", "#5adb82", "#34be5b"];
let total = data.reduce((a, b) => a+b, 0);
let angle = 0, pieSlices = "";
data.forEach((val, i) => {
  const arcLen = (val / total) * 2 * Math.PI;
  const x1 = 80 + 70 * Math.cos(angle - Math.PI/2);
  const y1 = 80 + 70 * Math.sin(angle - Math.PI/2);
  angle += arcLen;
  const x2 = 80 + 70 * Math.cos(angle - Math.PI/2);
  const y2 = 80 + 70 * Math.sin(angle - Math.PI/2);
  const largeArc = arcLen > Math.PI ? 1 : 0;
  pieSlices += `
    <path d="M80,80 L${x1},${y1} A70,70 0 ${largeArc} 1 ${x2},${y2} Z" fill="${colors[i]}"></path>
  `;
});
pie.innerHTML = `<circle cx="80" cy="80" r="70" fill="#eafbee"/>${pieSlices}`;
