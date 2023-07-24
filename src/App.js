import { useState } from "react";

const currentBills = [
  {
    id: 789607609,
    name: "rent",
    total: 820,
    date: 80123,
    paid: false,
  },
  {
    id: 789403257,
    name: "cell phone",
    total: 28,
    date: 81923,
    paid: false,
  },
  {
    id: 896938562,
    name: "internet",
    total: 90,
    date: 82023,
    paid: false,
  },
];

export default function App() {
  const [bills, setBills] = useState(currentBills);

  function handleAddBills(bill) {
    setBills((bills) => [...bills, bill]);
  }

  function handleDeleteBill(id) {
    setBills((bills) => bills.filter((bill) => bill.id !== id));
  }

  function handleTogglePaid(id) {
    setBills((bills) =>
      bills.map((item) =>
        item.id === id ? { ...item, paid: !item.paid } : item
      )
    );
  }

  return (
    <div className="App">
      <h1>Track my bills!</h1>
      <Form onAddBill={handleAddBills} />
      <MainContainer
        bills={bills}
        onDeleteBill={handleDeleteBill}
        onTogglePaid={handleTogglePaid}
      />
      <Stats bills={bills} />
    </div>
  );
}

function Form({ onAddBill }) {
  const [billName, setBillName] = useState("");
  const [billTotal, setBillTotal] = useState("");
  const [billDate, setBillDate] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const newBill = {
      id: Date.now(),
      name: billName,
      total: parseInt(billTotal),
      date: parseInt(billDate),
      paid: false,
    };

    onAddBill(newBill);
    setBillName("");
    setBillTotal("");
    setBillDate("");
  }

  function handleNoSubmit(e) {
    e.preventDefault();
  }

  return (
    <form
      onSubmit={
        billName !== "" && billTotal !== "" && billDate !== ""
          ? handleSubmit
          : handleNoSubmit
      }
    >
      <label>Add a bill: </label>
      <input
        type="text"
        value={billName}
        maxLength="20"
        onChange={(e) => setBillName(e.target.value)}
      />
      <label>Total: </label>
      <input
        type="text"
        value={billTotal}
        onChange={(e) =>
          isNaN(e.target.value) ? null : setBillTotal(e.target.value)
        }
      />
      <label>Date due: </label>
      <input
        type="text"
        value={billDate}
        onChange={(e) =>
          isNaN(e.target.value) ? null : setBillDate(e.target.value)
        }
      />
      <button>Submit</button>
    </form>
  );
}

function MainContainer({ bills, onDeleteBill, onTogglePaid }) {
  // const allBills = bills;
  const [sortBy, setSortBy] = useState("name");
  let sortedItems;

  if (sortBy === "name")
    sortedItems = bills.slice().sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "amount")
    sortedItems = bills
      .slice()
      .sort((a, b) => Number(b.total) - Number(a.total));
  if (sortBy === "date")
    sortedItems = bills.slice().sort((a, b) => Number(a.date) - Number(b.date));
  if (sortBy === "paid")
    sortedItems = bills.slice().sort((a, b) => Number(a.paid) - Number(b.paid));

  return (
    <div className="maincontainer">
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="amount">Sort by Amount Due</option>
          <option value="date">Sort by Date Due</option>
          <option value="paid">Sort by Paid</option>
        </select>
      </div>
      <div className="eachbill">
        <div className="billname title">Bill</div>
        <div className="title">Amount</div>
        <div className="title">Date Due</div>
        <div className="title">Paid/Remove</div>
      </div>
      <ul>
        {sortedItems.map((bill) => (
          <Bills
            bill={bill}
            key={bill.id}
            onDeleteBill={onDeleteBill}
            onTogglePaid={onTogglePaid}
          />
        ))}
      </ul>
    </div>
  );
}

function Bills({ bill, onDeleteBill, onTogglePaid }) {
  console.log(bill);
  return (
    <li className="billlist">
      <div className={bill.paid ? "eachbill paidstatus" : "eachbill"}>
        <div className="billname">{bill.name}</div>
        <div className="billtotal">${bill.total}</div>
        <div>{bill.date}</div>
        <div>
          <input
            type="checkbox"
            value={bill.paid}
            onChange={() => onTogglePaid(bill.id)}
          />
          <button onClick={() => onDeleteBill(bill.id)}>Remove</button>
        </div>
      </div>
    </li>
  );
}

function Stats({ bills }) {
  // const [total, setTotal] = useState(0);
  let owedStart = 0;
  console.log("before: " + owedStart);

  bills.forEach((bill) => {
    if (!bill.paid) {
      owedStart += bill.total;
    }
  });
  console.log("total owed: " + owedStart);

  return <div className="monthtotal">Total due: ${owedStart}</div>;
}
