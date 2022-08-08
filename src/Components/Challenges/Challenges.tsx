import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

export const Challenges = () => {
  return (
    <ProtectedRoute>
      <div style={{ textAlign: "center" }}>
        <h1>Challenges</h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio,
          facilis magnam? Cumque minus pariatur dolore, deserunt fugit, dolorum
          animi iusto ipsa ad odio aliquid quia sint exercitationem nostrum,
          iste ut?
        </p>
      </div>
    </ProtectedRoute>
  );
};
