import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bounce, ToastContainer, toast } from "react-toastify";
import {
  addTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
} from "../redux/todo/todoSlice";
import { logout } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { UserRoles } from "../types/user-roles";

const Todos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const todosFromRedux = useSelector((state: any) => state.todo.todos);
  const user = useSelector((state: any) => state.auth.user);
  const { userRole } = user;
  const [item, setItem] = useState<string>("");
  const [todos, setTodos] = useState<Object[]>([]);
  const [currentTodo, setCurrentTodo] = useState<Object>({});

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  useEffect(() => {
    setTodos(
      todosFromRedux.filter((todo: any) => {
        if (userRole === UserRoles.Admin) {
          return true;
        } else {
          return todo.user_id === user.id;
        }
      })
    );
  }, [todosFromRedux]);

  const handleAdd = () => {
    const newTodo = {
      id: todosFromRedux.length + 1,
      item,
      user_id: user.id,
    };

    dispatch(addTodo(newTodo)).then((res: any) => {
      toast.success(res.payload, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      dispatch(fetchTodos());
      setItem("");
    });
  };

  const handleEdit = async (todo: any) => {
    if (todo.isEdit) {
      dispatch(updateTodo({ id: todo.id, updatedTodo: currentTodo })).then(
        async (res: any) => {
          toast.info(res.payload, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          dispatch(fetchTodos());
        }
      );
    } else {
      setTodos((prev) =>
        prev.map((x: any) => {
          if (x.id === todo.id) {
            setCurrentTodo({ id: x.id, item: x.item });
          }
          return {
            ...x,
            isEdit: x.id === todo.id ? true : false,
          };
        })
      );
    }
  };

  const handleCancel = async (todo: any) => {
    if (!todo?.isEdit) {
      dispatch(deleteTodo(todo.id)).then((res: any) => {
        toast.error(res.payload, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        dispatch(fetchTodos());
      });
    } else {
      setCurrentTodo({ ...currentTodo, item: "" });
      setTodos((prev) =>
        prev.map((todo: any) => {
          setCurrentTodo(todo.item);
          return {
            ...todo,
            isEdit: false,
          };
        })
      );
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="max-w-[1440px] p-20 w-full">
      <div className="flex items-center justify-between">
        <p className="text-3xl mb-4">Todos</p>
        <button
          className="border border-red-400 rounded-md text-red-400 px-3 hover:bg-red-400 hover:text-white py-1"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="border rounded-md pl-2 py-1"
            placeholder="Add a todo item"
            aria-label="Add a todo item"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="border border-green-400 px-2 rounded-md text-green-400"
          >
            Add
          </button>
        </div>
        <div className="absolute right-2 top-2">
          <ToastContainer />
        </div>
      </div>
      <table className="border w-full">
        <thead>
          <tr>
            <th className="border w-[60px]">ID</th>
            <th className="border">Description</th>
            {userRole === UserRoles.Admin && <th className="border">User</th>}
            {userRole === UserRoles.Admin && (
              <th className="border w-[200px]">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {todos.map((todo: any, index: number) => (
            <tr key={`item_${index}`}>
              <td className="border text-center">{todo.id}</td>
              <td className="border text-center">
                {!todo?.isEdit ? (
                  <p>{todo.item}</p>
                ) : (
                  <input
                    className="w-full border rounded-md pl-2"
                    // @ts-ignore
                    value={currentTodo.item}
                    onChange={(e) => setCurrentTodo(e.target.value)}
                  />
                )}
              </td>
              {userRole === UserRoles.Admin && (
                <td className="border">
                  <p>{todo.user}</p>
                </td>
              )}
              {userRole === UserRoles.Admin && (
                <td className="border flex gap-2">
                  <button
                    className="text-green-600"
                    onClick={() => handleEdit(todo)}
                  >
                    {todo?.isEdit ? "Update" : "Edit"}
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleCancel(todo)}
                  >
                    {todo?.isEdit ? "Cancel" : "Delete"}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Todos;
