import FetchUsers from "../FetchUsers";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import "../index.css";

const Dashboard = () => {
  const { users, loading } = FetchUsers();

  if (loading) return <p>Loading...</p>;

  // 1. Total users
  const totalUsers = users.length;

  // 2. Avatar distribution
  let withAvatar = 0;
  let withoutAvatar = 0;
  users.map((u) => {
    if (u.avatar) withAvatar++;
    else withoutAvatar++;
    return null;
  });

  const avatarData = [
    { name: "With Avatar", value: withAvatar },
    { name: "No Avatar", value: withoutAvatar },
  ];

  // 3. Recently joined users (latest 5)
  const recentUsers = users
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // 4. Users per day (group by date)

  const today = new Date();
  const perDayData = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
    const count = users.filter((u) => u.createdAt?.startsWith(dateStr)).length;

    perDayData.push({
      date: d.toLocaleDateString("en-US", { day: "2-digit", month: "short" }), // e.g. "08 Sep"
      count,
    });
  }

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="dashboard">
        {/* Total Users */}
        <div className="dashboard-tile">
          <h3>Total Users</h3>
          <div className="dashboard-number">{totalUsers}</div>
        </div>

        {/* Users per Day - Bar Chart */}
        <div className="chart-container">
          <h3>Users Per Day</h3>
          <BarChart width={400} height={250} data={perDayData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Avatar Distribution - Pie Chart */}
        <div className="chart-container">
          <h3>Avatar Distribution</h3>
          <PieChart width={300} height={250}>
            <Pie
              data={avatarData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              <Cell fill="#82ca9d" />
              <Cell fill="#8884d8" />
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Recently Joined */}
        <div className="users-container">
          <h3>Recently Joined</h3>
          <ul>
            {recentUsers.map((u) => (
              <li key={u.id}>
                {u.name} – {new Date(u.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
