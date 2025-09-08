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

const Dashboard = () => {
  const { users, loading } = FetchUsers();
  if (loading) return <p>Loading...</p>;

  // Total Users
  const totalUsers = users.length;

  // Users Created Per Day (last 30 days)
  const today = new Date();
  const last30 = [...Array(30)]
    .map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    })
    .reverse();

  const perDay = last30.map((date) => ({
    date,
    count: users.filter((u) => u.createdAt?.startsWith(date)).length,
  }));

  // Avatar distribution
  const avatarData = [
    { name: "With Avatar", value: users.filter((u) => u.avatar).length },
    { name: "No Avatar", value: users.filter((u) => !u.avatar).length },
  ];

  // Recently Joined (latest 5)
  const recent = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="dashboard">
      <div className="dashboard-tile">
        <h3>Total Users</h3>
        <div className="dashboard-number">{totalUsers}</div>
      </div>

      <div className="chart-container">
        <h3>Users Created Per Day</h3>
        <BarChart width={400} height={250} data={perDay}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </div>

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

      <div className="recent-users">
        <h3>Recently Joined</h3>
        <ul>
          {recent.map((u) => (
            <li key={u.id}>
              {u.name} - {new Date(u.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
