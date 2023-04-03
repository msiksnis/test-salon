import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen">
      <Header />
      <div className="relative transition-all duration-300">{children}</div>
    </div>
  );
}
