interface NavigationProps {}

export function Navigation({}: NavigationProps) {
  return (
    <nav className="nav">
      <div className="logo">iembraceland</div>
      <div className="links">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#how-it-works">How it works</a>
        <a href="#features">Features</a>
      </div>
    </nav>
  )
}
