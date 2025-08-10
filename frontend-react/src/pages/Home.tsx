import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  increment,
  decrement,
  incrementByAmount,
} from '../store/slices/counterSlice';

function Home() {
  const count = useAppSelector(state => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="page-container">
      <h1>Home Page</h1>
      <div className="counter-section">
        <h2>Counter: {count}</h2>
        <div className="button-group">
          <button onClick={() => dispatch(increment())}>+</button>
          <button onClick={() => dispatch(decrement())}>-</button>
          <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
