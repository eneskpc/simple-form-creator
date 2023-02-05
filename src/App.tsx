import { useAppSelector } from "./app/hooks";
import FormDetail from "./components/FormDetail";
import FormList from "./components/FormList";

function App() {
  const selectedForm = useAppSelector((state) =>
    state.form.forms.find((f) => f.isSelected)
  );

  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="max-w-5xl w-full">
        {selectedForm ? <FormDetail /> : <FormList />}
      </div>
    </div>
  );
}

export default App;
