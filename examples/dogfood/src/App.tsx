import { useTheme } from "@klh-app/theme";

function App() {
  const { theme, resolvedTheme, setTheme, systemTheme, themes } = useTheme();

  return (
    <div className="container">
      <h1>@klh-app/theme dogfood</h1>

      <div className="card">
        <h2>Current state</h2>
        <table>
          <tbody>
            <tr><td>theme</td><td><code>{theme}</code></td></tr>
            <tr><td>resolvedTheme</td><td><code>{resolvedTheme}</code></td></tr>
            <tr><td>systemTheme</td><td><code>{systemTheme ?? "undefined"}</code></td></tr>
            <tr><td>themes</td><td><code>{JSON.stringify(themes)}</code></td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Theme switcher</h2>
        <div className="buttons">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={theme === t ? "active" : ""}
            >
              {t === "light" ? "☀️" : t === "dark" ? "🌙" : t === "system" ? "💻" : ""} {t}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>setTheme updater function</h2>
        <button onClick={() => setTheme((prev) => prev === "dark" ? "light" : "dark")}>
          Toggle (updater fn)
        </button>
      </div>

      <div className="card">
        <h2>Instructions</h2>
        <ul>
          <li>Toggle themes above and check <code>data-theme</code> on <code>&lt;html&gt;</code></li>
          <li>Open this page in a second tab — change theme in one, watch the other sync</li>
          <li>Change OS appearance (System Preferences → Appearance) with "system" selected</li>
          <li>Check DevTools console for errors</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
