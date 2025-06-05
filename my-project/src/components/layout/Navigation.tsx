interface NavigationProps {}

export function Navigation({}: NavigationProps) {
  return (
    <nav className="nav" style={{ fontFamily: '"Source Sans Pro", sans-serif' }}>
      <div className="logo" style={{ fontFamily: '"Source Sans Pro", sans-serif' }}>iembraceland</div>
      <div className="links" style={{ fontFamily: '"Source Sans Pro", sans-serif' }}>
        <a href="#home" style={{ fontFamily: '"Source Sans Pro", sans-serif' }}>Home</a>
        <a href="#about" style={{ fontFamily: '"Source Sans Pro", sans-serif' }}>About</a>
        <a href="#how-it-works" style={{ fontFamily: '"Source Sans Pro", sans-serif' }}>How it works</a>
        <a href="#features" style={{ fontFamily: '"Source Sans Pro", sans-serif' }}>Features</a>
      </div>
    </nav>
  )
}
