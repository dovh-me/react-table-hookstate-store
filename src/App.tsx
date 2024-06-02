import { useCallback } from "react";
import Table from "./components/Table";
import data from "./data";
import { Model, Store } from "./hookstate";

const store = new Store();

data.forEach((item: Model) => {
  store.addItem(item.exchange, `${item.exchange}-${item.symbol}`, item);
});

function App() {
  const tableData = store.getGroup("TDWL");

  const handleCreateItem = useCallback(() => {
    const item = {
      exchange: "TDWL",
      symbol: Date.now().toString(),
      description: "DESC",
      lastTradePrice: 10,
      change: 0,
      percentage: 0,
    };
    store.addItem(item.exchange, item.symbol, item);
  }, []);

  return (
    <>
      <h1>TanStack React Table - Hookstate</h1>
      <Table data={tableData} />
      <button onClick={handleCreateItem}>Create Item</button>
    </>
  );
}

export default App;
