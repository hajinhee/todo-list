console.clear();

// # 임포트 시작
const { useState, useRef, useEffect, useMemo } = React;

import classNames from "https://cdn.skypack.dev/classnames";

import { produce } from "https://cdn.skypack.dev/immer";

const {
  RecoilRoot,
  atom,
  atomFamily,
  useRecoilState,
  useSetRecoilState,
  useRecoilValue
} = Recoil;

import { recoilPersist } from "https://cdn.skypack.dev/recoil-persist";

const {
  HashRouter: Router,
  Routes,
  Route,
  NavLink,
  Navigate,
  useParams,
  useNavigate,
  useLocation
} = ReactRouterDOM;

const {
  colors,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Link,
  Button,
  AppBar,
  Toolbar,
  TextField,
  Chip,
  Box,
  SwipeableDrawer,
  List,
  ListItem,
  Divider,
  Modal,
  Snackbar,
  Alert,
  Tabs,
  Tab
} = MaterialUI;
// # 임포트 끝

// # 유틸리티 시작

// # 리코일 퍼시스트 저장소 시작
const { persistAtom: persistAtomCommon } = recoilPersist({
  key: "persistAtomCommon"
});

const todosAtom = atom({
  key: "app/todosAtom",
  default: [],
  effects_UNSTABLE: [persistAtomCommon]
});

// 할일 카운트 리코일 퍼시스트
const todosCountAtom = atom({
  key: "app/todosCountAtom",
  default: 0,
  effects_UNSTABLE: [persistAtomCommon]
});

const snackbarAtom = atom({
  key: "app/snackbarAtom",
  default: {
    opened: false,
    duration: 0,
    severity: "",
    msg: ""
  }
});

const TodoList__filterCompletedIndexAtom = atom({
  key: "app/TodoList__filterCompletedIndexAtom",
  default: 0,
  effects_UNSTABLE: [persistAtomCommon]
});

const TodoList__sortIndexAtom = atom({
  key: "app/TodoList__sortIndexAtom",
  default: 0,
  effects_UNSTABLE: [persistAtomCommon]
});

function useNoticeSnackbarStatus() {
  const [noticeSnackbarInfo, setNoticeSnackbarInfo] = useRecoilState(
    noticeSnackbarInfoAtom
  );

  const opened = noticeSnackbarInfo.opened;
  const autoHideDuration = noticeSnackbarInfo.autoHideDuration;
  const severity = noticeSnackbarInfo.severity;
  const msg = noticeSnackbarInfo.msg;

  const open = (msg, severity = "success", autoHideDuration = 6000) => {
    setNoticeSnackbarInfo({
      opened: true,
      msg,
      severity,
      autoHideDuration
    });
  };

  const close = () => {
    setNoticeSnackbarInfo({
      ...noticeSnackbarInfo,
      opened: false
    });
  };

  return {
    opened,
    open,
    close,
    autoHideDuration,
    severity,
    msg
  };
}

const CustomAlert = React.forwardRef((props, ref) => {
  return <Alert {...props} ref={ref} />;
});

function SnackBar() {
  const status = useSnackBarStatus();

  return (
    <>
      <Snackbar
        open={status.opened}
        autoHideDuration={status.duration}
        onClose={status.close}
      >
        <CustomAlert severity={status.severity} sx={{ width: "100%" }}>
          {status.msg}
        </CustomAlert>
      </Snackbar>
    </>
  );
}

// # 비지니스 로직 시작
function useTodosStatus() {
  const [todos, setTodos] = useRecoilState(todosAtom);
  const [todosCount, setTodosCount] = useRecoilState(todosCountAtom);
  const todosCountRef = useRef(todosCount);

  todosCountRef.current = todosCount;

  // 할일 추가
  const addTodo = (performDate, newContent) => {
    const id = ++todosCountRef.current;
    setTodosCount(id);
    const newTodos = {
      id: id,
      content: newContent,
      regDate: new Date().toISOString(),
      performDate: performDate,
      checked: false
    };
    setTodos((todos) => [newTodos, ...todos]);

    return id;
  };

  // 할일 삭제
  const deleteTodo = (id) => {
    const newTodos = todos.filter((el, _) => id !== el.id);
    setTodos(newTodos);
  };

  // 할일 수정
  const modifyTodo = (id, performDate, newContent) => {
    const newTodos = todos.map((el) =>
      el.id == id
        ? {
            ...el,
            performDate: performDate,
            content: newContent
          }
        : el
    );

    setTodos(newTodos);
  };

  // 할일 완료 여부 체크
  const toggleCheckBox = (id) => {
    const newTodos = todos.map((el) =>
      el.id === id
        ? {
            ...el,
            checked: !el.checked
          }
        : el
    );

    setTodos(newTodos);
  };

  return {
    todos,
    addTodo,
    deleteTodo,
    modifyTodo,
    toggleCheckBox
  };
}

function useSnackBarStatus() {
  const [snackbar, setSnackbar] = useRecoilState(snackbarAtom);

  const opened = snackbar.opened;
  const duration = snackbar.duration;
  const severity = snackbar.severity;
  const msg = snackbar.msg;

  const open = (msg, severity = "success", duration = 3000) => {
    setSnackbar({
      opened: true,
      duration: duration,
      severity: severity,
      msg: msg
    });
  };

  const close = () => setSnackbar({ ...snackbar, opened: false });

  return {
    opened,
    duration,
    severity,
    msg,
    open,
    close
  };
}

function useDrawerStatus() {
  const [openedId, setOpenedId] = useState(null);
  const opened = useMemo(() => openedId !== null, [openedId]);

  const open = (id) => {
    setOpenedId(id);
  };

  const close = () => {
    setOpenedId(null);
  };

  return {
    openedId,
    opened,
    open,
    close
  };
}

// ## 메인 페이지관련 컴포넌트 시작
function TodosEmpty() {
  return (
    <>
      <div className="flex-1 flex justify-center items-center">
        <div className="grid gap-6">
          <span>
            <span className="text-[color:var(--mui-color-primary-main)]">
              할일
            </span>
            을 입력해주세요.
          </span>
          <Button
            size="large"
            variant="contained"
            component={NavLink}
            to="/write"
          >
            <span className="!pt-1">할일 추가하기</span>
          </Button>
        </div>
      </div>
    </>
  );
}

function Drawer({ status }) {
  const todosStatus = useTodosStatus();
  const snackbarStatus = useSnackBarStatus();

  const deleteTodoBtn = () => {
    if (confirm(`${status.openedId}번 할일을 삭제하시겠습니까?`)) {
      todosStatus.deleteTodo(status.openedId);
      snackbarStatus.open(`${status.openedId}번 할일이 삭제되었습니다.`);
    }
    status.close();
  };

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={status.opened}
        onClose={status.close}
        onOpen={() => {}}
      >
        <List>
          <ListItem className="flex gap-2">
            <span className="text-[color:var(--mui-color-primary-main)]">
              No.{status.openedId}
            </span>
            <span>To-Do</span>
          </ListItem>
          <Divider />
          <ListItem button onClick={deleteTodoBtn}>
            <span className="pt-2">🗑️ 삭제</span>
          </ListItem>
          <ListItem button component={NavLink} to={`/edit/${status.openedId}`}>
            <span className="pt-2">✏️ 수정</span>
          </ListItem>
        </List>
      </SwipeableDrawer>
    </>
  );
}

function TodoList() {
  const [todosCount, setTodosCount] = useRecoilState(todosCountAtom);
  const todosStatus = useTodosStatus();
  const drawerStatus = useDrawerStatus();

  const [filterCompletedIndex, setFilterCompletedIndex] = useRecoilState(
    TodoList__filterCompletedIndexAtom
  );

  const [sortIndex, setSortIndex] = useRecoilState(TodoList__sortIndexAtom);

  const filteredTodos = useMemo(() => {
    return filterCompletedIndex === 1
      ? todosStatus.todos.filter((el) => !el.checked)
      : filterCompletedIndex === 2
      ? todosStatus.todos.filter((el) => el.checked)
      : todosStatus.todos;
  }, [filterCompletedIndex, todosStatus.todos]);

  const sortedTodos = useMemo(
    () =>
      [...filteredTodos].sort((a, b) => {
        const performDateA = new Date(a.performDate).getTime();
        const performDateB = new Date(b.performDate).getTime();
        const regDateA = new Date(a.regDate).getTime();
        const regDateB = new Date(b.regDate).getTime();

        return sortIndex === 0
          ? performDateA - performDateB
          : sortIndex === 1
          ? performDateB - performDateA
          : sortIndex === 2
          ? regDateA - regDateB
          : regDateB - regDateA;
      }),
    [sortIndex, filteredTodos]
  );

  return (
    <>
      <Drawer status={drawerStatus} />
      <Tabs
        variant="fullWidth"
        value={filterCompletedIndex}
        onChange={(event, newValue) => setFilterCompletedIndex(newValue)}
      >
        <Tab
          label={
            <span className="flex">
              <i className="fa-solid fa-list-ul"></i>
              <span className="ml-2">전체</span>
            </span>
          }
          value={0}
        />
        <Tab
          label={
            <span className="flex">
              <i className="fa-regular fa-square"></i>
              <span className="ml-2">미완료</span>
            </span>
          }
          value={1}
        />
        <Tab
          label={
            <span className="flex">
              <i className="fa-regular fa-square-check"></i>
              <span className="ml-2">완료</span>
            </span>
          }
          value={2}
        />
      </Tabs>
      <Tabs
        variant="scrollable"
        value={sortIndex}
        onChange={(event, newValue) => {
          setSortIndex(newValue);
        }}
      >
        <Tab
          className="flex-grow !max-w-[none] px-4"
          label={
            <span className="flex items-baseline">
              <i className="fa-regular fa-clock mr-2"></i>
              <span className="mr-2 whitespace-nowrap">급해요</span>
              <i className="fa-solid fa-sort-up relative top-[3px]"></i>
            </span>
          }
          value={0}
        />
        <Tab
          className="flex-grow !max-w-[none] px-4"
          label={
            <span className="flex items-baseline">
              <i className="fa-regular fa-clock mr-2"></i>
              <span className="mr-2 whitespace-nowrap">널널해요</span>
              <i className="fa-solid fa-sort-down relative top-[-3px]"></i>
            </span>
          }
          value={1}
        />
        <Tab
          className="flex-grow !max-w-[none] px-4"
          label={
            <span className="flex items-baseline">
              <i className="fa-solid fa-pen mr-2"></i>
              <span className="mr-2 whitespace-nowrap">작성순</span>
              <i className="fa-solid fa-sort-up relative top-[3px]"></i>
            </span>
          }
          value={2}
        />
        <Tab
          className="flex-grow !max-w-[none] px-4"
          label={
            <span className="flex items-baseline">
              <i className="fa-solid fa-pen mr-2"></i>
              <span className="mr-2 whitespace-nowrap">작성순</span>
              <i className="fa-solid fa-sort-down relative top-[-3px]"></i>
            </span>
          }
          value={3}
        />
      </Tabs>
      <div className="p-5 sm:p-10">
        {sortedTodos.map((el, index) => (
          <TodoListItem
            key={index}
            todo={el}
            drawer={drawerStatus}
            toggleCheckBox={todosStatus.toggleCheckBox}
          />
        ))}
      </div>
    </>
  );
}

function TodoListItem({ todo, drawer, toggleCheckBox }) {
  return (
    <>
      <div className="flex gap-1 py-3">
        <Chip
          label={`No.${todo.id}`}
          variant="contained"
          color="primary"
          className="!pt-1"
        />
        <Chip
          label={new Date(todo.performDate).toLocaleString()}
          variant="outlined"
          className="!pt-1"
        />
      </div>
      <div className="flex items-center !rounded-2xl shadow mb-3 sm:mb-6">
        <Button
          className="!rounded-l-2xl flex-shrink-0 flex !items-start"
          color="inherit"
          onClick={() => toggleCheckBox(todo.id)}
        >
          <span
            className={classNames(
              "text-3xl",
              "sm:text-4xl",
              "h-[60px]",
              "sm:h-[80px]",
              "flex",
              "items-center",
              { "text-[#dcdcdc]": todo.checked !== true },
              {
                "text-[color:var(--mui-color-primary-main)]":
                  todo.checked === true
              }
            )}
          >
            <i className="fa-solid fa-check"></i>
          </span>
        </Button>
        <div className="w-[2px] bg-[#dcdcdc] mr-3 my-4 sd:mr-4 sm:my-5"></div>
        <div className="flex-grow whitespace-pre-wrap leading-loose !my-3 flex items-center text-[14px] sm:text-[16px]">
          {todo.content}
        </div>
        <Button
          className="!rounded-r-2xl flex-shrink-0 flex !items-start"
          color="inherit"
          onClick={() => drawer.open(todo.id)}
        >
          <span className="text-2xl sm:text-3xl h-[60px] sm:h-[80px] flex items-center text-[#dcdcdc]">
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </span>
        </Button>
      </div>
    </>
  );
}

// ## 메인 페이지 시작
function MainPage() {
  const todosStatus = useTodosStatus();
  if (todosStatus.todos.length === 0) return <TodosEmpty />;

  return (
    <>
      <TodoList />
    </>
  );
}

// ## 글쓰기 페이지 시작
function WritePage() {
  const todosStatus = useTodosStatus();
  const snackbarStatus = useSnackBarStatus();

  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    if (form.content.value.length === 0) {
      alert("할일을 입력해 주세요.");
      form.content.focus();
      return;
    }

    if (form.performDate.value.length === 0) {
      alert("날짜를 입력해 주세요.");
      form.performDate.focus();
      return;
    }

    const id = todosStatus.addTodo(form.performDate.value, form.content.value);
    form.performDate.value = "";
    form.content.value = "";

    snackbarStatus.open(`${id}번 할일이 추가되었습니다.`);
  };
  return (
    <>
      <form
        className="flex flex-col gap-3 sm:gap-5 flex-1 p-5 sm:p-10"
        onSubmit={onSubmit}
      >
        <TextField
          name="performDate"
          label="언제 해야 하나요?"
          focused
          type="datetime-local"
        ></TextField>
        <TextField
          name="content"
          label="무엇을 해야 하나요?"
          type="text"
          className="flex-1"
          multiline
          InputProps={{ className: "flex-1 flex-col" }}
        ></TextField>
        <Button variant="contained" type="submit">
          <span className="pt-1">➕&nbsp;할일 추가</span>
        </Button>
      </form>
    </>
  );
}

function EditPage() {
  const { id } = useParams();
  const todosStatus = useTodosStatus();
  const snackbarStatus = useSnackBarStatus();

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    if (form.content.value.length === 0) {
      alert("할일을 입력해 주세요.");
      form.content.focus();
      return;
    }

    if (form.performDate.value.length === 0) {
      alert("날짜를 입력해 주세요.");
      form.performDate.focus();
      return;
    }

    todosStatus.modifyTodo(id, form.performDate.value, form.content.value);
    form.performDate.value = "";
    form.content.value = "";

    snackbarStatus.open(`${id}번 할일이 수정되었습니다.`);

    navigate(-1); // 메인 페이지로 이동
  };

  // 기존 작성 기록
  const beforeTodo = todosStatus.todos.find((el) => el.id == id);
  const beforeRegDate = beforeTodo?.performDate;
  const beforeContent = beforeTodo?.content;

  return (
    <>
      <form className="flex flex-col gap-5 flex-1 p-10" onSubmit={onSubmit}>
        <TextField
          name="performDate"
          label="언제 해야 하나요?"
          focused
          type="datetime-local"
          defaultValue={beforeRegDate}
        ></TextField>
        <TextField
          name="content"
          label="무엇을 해야 하나요?"
          type="text"
          className="flex-1"
          multiline
          InputProps={{ className: "flex-1 flex-col" }}
          defaultValue={beforeContent}
        ></TextField>
        <Button variant="contained" type="submit">
          <span className="pt-1">✏️&nbsp;할일 수정 </span>
        </Button>
      </form>
    </>
  );
}

// # 앱 세팅
function App() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <div className="flex-grow-0 sm:flex-1"></div>
          <NavLink
            to="/main"
            className="font-bold select-none cursor-pointer self-stretch flex items-center"
          >
            🐰 Jini’s To-Do 🐰
          </NavLink>
          <div className="flex-grow"></div>
          <div className="self-stretch flex items-center">
            {location.pathname == "/main" && (
              <NavLink
                className="select-none self-stretch flex items-center"
                to="/write"
              >
                할일 추가
              </NavLink>
            )}
            {location.pathname != "/main" && (
              <button
                onClick={() => navigate(-1)}
                className="select-none self-stretch flex items-center"
              >
                이전
              </button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <SnackBar />
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/edit/:id" element={<EditPage />} />
        <Route path="*" element={<Navigate to="/main" />} />
      </Routes>
    </>
  );
}

const muiThemePaletteKeys = [
  "background",
  "common",
  "error",
  "grey",
  "info",
  "primary",
  "secondary",
  "success",
  "text",
  "warning"
];

function Root() {
  const theme = createTheme({
    typography: {
      fontFamily: ["GmarketSansMedium"]
    },
    palette: {
      primary: {
        main: "#FFF2B2",
        light: "#FFF4C1",
        dark: "#B2A97C",
        contrastText: "#010101"
      },
      secondary: {
        main: "#B2A97C",
        light: "#F8D8DF",
        dark: "#AC9097",
        contrastText: "#000000"
      }
    }
  });

  useEffect(() => {
    const r = document.querySelector(":root");

    muiThemePaletteKeys.forEach((paletteKey) => {
      const themeColorObj = theme.palette[paletteKey];

      for (const key in themeColorObj) {
        if (Object.hasOwnProperty.call(themeColorObj, key)) {
          const colorVal = themeColorObj[key];
          r.style.setProperty(`--mui-color-${paletteKey}-${key}`, colorVal);
        }
      }
    });
  }, []);

  return (
    <RecoilRoot>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Router>
    </RecoilRoot>
  );
}

ReactDOM.render(<Root />, document.getElementById("root"));
// # 앱 세팅 끝
