import Table from './components/Table';
import data from './data';
import { Store } from './hookstate';

const store = new Store();

data.forEach((item: any) => {
  store.addItem(item.exchange, `${item.exchange}-${item.symbol}`, item);
});

function App() {
  const tableData = store.getGroup('TDWL');

  return (
    <>
      <h1>TanStack React Table - Hookstate</h1>
      <Table data={tableData} />
    </>
  );
}

export default App;
