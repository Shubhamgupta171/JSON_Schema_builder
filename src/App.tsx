import { SchemaBuilder } from './components/SchemaBuilder';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <div className="App">
      <SchemaBuilder />
      <Toaster />
    </div>
  );
}

export default App;