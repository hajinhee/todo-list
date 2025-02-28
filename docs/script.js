function _extends() {_extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};return _extends.apply(this, arguments);}console.clear();

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
  useRecoilValue } =
Recoil;

import { recoilPersist } from "https://cdn.skypack.dev/recoil-persist";

const {
  HashRouter: Router,
  Routes,
  Route,
  NavLink,
  Navigate,
  useParams,
  useNavigate,
  useLocation } =
ReactRouterDOM;

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
  Tab } =
MaterialUI;
// # 임포트 끝

// # 유틸리티 시작

// # 리코일 퍼시스트 저장소 시작
const { persistAtom: persistAtomCommon } = recoilPersist({
  key: "persistAtomCommon" });


const todosAtom = atom({
  key: "app/todosAtom",
  default: [],
  effects_UNSTABLE: [persistAtomCommon] });


// 할일 카운트 리코일 퍼시스트
const todosCountAtom = atom({
  key: "app/todosCountAtom",
  default: 0,
  effects_UNSTABLE: [persistAtomCommon] });


const snackbarAtom = atom({
  key: "app/snackbarAtom",
  default: {
    opened: false,
    duration: 0,
    severity: "",
    msg: "" } });



const TodoList__filterCompletedIndexAtom = atom({
  key: "app/TodoList__filterCompletedIndexAtom",
  default: 0,
  effects_UNSTABLE: [persistAtomCommon] });


const TodoList__sortIndexAtom = atom({
  key: "app/TodoList__sortIndexAtom",
  default: 0,
  effects_UNSTABLE: [persistAtomCommon] });


function useNoticeSnackbarStatus() {
  const [noticeSnackbarInfo, setNoticeSnackbarInfo] = useRecoilState(
  noticeSnackbarInfoAtom);


  const opened = noticeSnackbarInfo.opened;
  const autoHideDuration = noticeSnackbarInfo.autoHideDuration;
  const severity = noticeSnackbarInfo.severity;
  const msg = noticeSnackbarInfo.msg;

  const open = (msg, severity = "success", autoHideDuration = 6000) => {
    setNoticeSnackbarInfo({
      opened: true,
      msg,
      severity,
      autoHideDuration });

  };

  const close = () => {
    setNoticeSnackbarInfo({
      ...noticeSnackbarInfo,
      opened: false });

  };

  return {
    opened,
    open,
    close,
    autoHideDuration,
    severity,
    msg };

}

const CustomAlert = React.forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(Alert, _extends({}, props, { ref: ref }));
});

function SnackBar() {
  const status = useSnackBarStatus();

  return /*#__PURE__*/(
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement(Snackbar, {
      open: status.opened,
      autoHideDuration: status.duration,
      onClose: status.close }, /*#__PURE__*/

    React.createElement(CustomAlert, { severity: status.severity, sx: { width: "100%" } },
    status.msg))));




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
      checked: false };

    setTodos(todos => [newTodos, ...todos]);

    return id;
  };

  // 할일 삭제
  const deleteTodo = id => {
    const newTodos = todos.filter((el, _) => id !== el.id);
    setTodos(newTodos);
  };

  // 할일 수정
  const modifyTodo = (id, performDate, newContent) => {
    const newTodos = todos.map((el) =>
    el.id == id ?
    {
      ...el,
      performDate: performDate,
      content: newContent } :

    el);


    setTodos(newTodos);
  };

  // 할일 완료 여부 체크
  const toggleCheckBox = id => {
    const newTodos = todos.map((el) =>
    el.id === id ?
    {
      ...el,
      checked: !el.checked } :

    el);


    setTodos(newTodos);
  };

  return {
    todos,
    addTodo,
    deleteTodo,
    modifyTodo,
    toggleCheckBox };

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
      msg: msg });

  };

  const close = () => setSnackbar({ ...snackbar, opened: false });

  return {
    opened,
    duration,
    severity,
    msg,
    open,
    close };

}

function useDrawerStatus() {
  const [openedId, setOpenedId] = useState(null);
  const opened = useMemo(() => openedId !== null, [openedId]);

  const open = id => {
    setOpenedId(id);
  };

  const close = () => {
    setOpenedId(null);
  };

  return {
    openedId,
    opened,
    open,
    close };

}

// ## 메인 페이지관련 컴포넌트 시작
function TodosEmpty() {
  return /*#__PURE__*/(
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("div", { className: "flex-1 flex justify-center items-center" }, /*#__PURE__*/
    React.createElement("div", { className: "grid gap-6" }, /*#__PURE__*/
    React.createElement("span", null, /*#__PURE__*/
    React.createElement("span", { className: "text-[color:var(--mui-color-primary-main)]" }, "\uD560\uC77C"), "\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694."), /*#__PURE__*/




    React.createElement(Button, {
      size: "large",
      variant: "contained",
      component: NavLink,
      to: "/write" }, /*#__PURE__*/

    React.createElement("span", { className: "!pt-1" }, "\uD560\uC77C \uCD94\uAC00\uD558\uAE30"))))));





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

  return /*#__PURE__*/(
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement(SwipeableDrawer, {
      anchor: "bottom",
      open: status.opened,
      onClose: status.close,
      onOpen: () => {} }, /*#__PURE__*/

    React.createElement(List, null, /*#__PURE__*/
    React.createElement(ListItem, { className: "flex gap-2" }, /*#__PURE__*/
    React.createElement("span", { className: "text-[color:var(--mui-color-primary-main)]" }, "No.",
    status.openedId), /*#__PURE__*/

    React.createElement("span", null, "To-Do")), /*#__PURE__*/

    React.createElement(Divider, null), /*#__PURE__*/
    React.createElement(ListItem, { button: true, onClick: deleteTodoBtn }, /*#__PURE__*/
    React.createElement("span", { className: "pt-2" }, "\uD83D\uDDD1\uFE0F \uC0AD\uC81C")), /*#__PURE__*/

    React.createElement(ListItem, { button: true, component: NavLink, to: `/edit/${status.openedId}` }, /*#__PURE__*/
    React.createElement("span", { className: "pt-2" }, "\u270F\uFE0F \uC218\uC815"))))));





}

function TodoList() {
  const [todosCount, setTodosCount] = useRecoilState(todosCountAtom);
  const todosStatus = useTodosStatus();
  const drawerStatus = useDrawerStatus();

  const [filterCompletedIndex, setFilterCompletedIndex] = useRecoilState(
  TodoList__filterCompletedIndexAtom);


  const [sortIndex, setSortIndex] = useRecoilState(TodoList__sortIndexAtom);

  const filteredTodos = useMemo(() => {
    return filterCompletedIndex === 1 ?
    todosStatus.todos.filter(el => !el.checked) :
    filterCompletedIndex === 2 ?
    todosStatus.todos.filter(el => el.checked) :
    todosStatus.todos;
  }, [filterCompletedIndex, todosStatus.todos]);

  const sortedTodos = useMemo(
  () =>
  [...filteredTodos].sort((a, b) => {
    const performDateA = new Date(a.performDate).getTime();
    const performDateB = new Date(b.performDate).getTime();
    const regDateA = new Date(a.regDate).getTime();
    const regDateB = new Date(b.regDate).getTime();

    return sortIndex === 0 ?
    performDateA - performDateB :
    sortIndex === 1 ?
    performDateB - performDateA :
    sortIndex === 2 ?
    regDateA - regDateB :
    regDateB - regDateA;
  }),
  [sortIndex, filteredTodos]);


  return /*#__PURE__*/(
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement(Drawer, { status: drawerStatus }), /*#__PURE__*/
    React.createElement(Tabs, {
      variant: "fullWidth",
      value: filterCompletedIndex,
      onChange: (event, newValue) => setFilterCompletedIndex(newValue) }, /*#__PURE__*/

    React.createElement(Tab, {
      label: /*#__PURE__*/
      React.createElement("span", { className: "flex" }, /*#__PURE__*/
      React.createElement("i", { className: "fa-solid fa-list-ul" }), /*#__PURE__*/
      React.createElement("span", { className: "ml-2" }, "\uC804\uCCB4")),


      value: 0 }), /*#__PURE__*/

    React.createElement(Tab, {
      label: /*#__PURE__*/
      React.createElement("span", { className: "flex" }, /*#__PURE__*/
      React.createElement("i", { className: "fa-regular fa-square" }), /*#__PURE__*/
      React.createElement("span", { className: "ml-2" }, "\uBBF8\uC644\uB8CC")),


      value: 1 }), /*#__PURE__*/

    React.createElement(Tab, {
      label: /*#__PURE__*/
      React.createElement("span", { className: "flex" }, /*#__PURE__*/
      React.createElement("i", { className: "fa-regular fa-square-check" }), /*#__PURE__*/
      React.createElement("span", { className: "ml-2" }, "\uC644\uB8CC")),


      value: 2 })), /*#__PURE__*/


    React.createElement(Tabs, {
      variant: "scrollable",
      value: sortIndex,
      onChange: (event, newValue) => {
        setSortIndex(newValue);
      } }, /*#__PURE__*/

    React.createElement(Tab, {
      className: "flex-grow !max-w-[none] px-4",
      label: /*#__PURE__*/
      React.createElement("span", { className: "flex items-baseline" }, /*#__PURE__*/
      React.createElement("i", { className: "fa-regular fa-clock mr-2" }), /*#__PURE__*/
      React.createElement("span", { className: "mr-2 whitespace-nowrap" }, "\uAE09\uD574\uC694"), /*#__PURE__*/
      React.createElement("i", { className: "fa-solid fa-sort-up relative top-[3px]" })),


      value: 0 }), /*#__PURE__*/

    React.createElement(Tab, {
      className: "flex-grow !max-w-[none] px-4",
      label: /*#__PURE__*/
      React.createElement("span", { className: "flex items-baseline" }, /*#__PURE__*/
      React.createElement("i", { className: "fa-regular fa-clock mr-2" }), /*#__PURE__*/
      React.createElement("span", { className: "mr-2 whitespace-nowrap" }, "\uB110\uB110\uD574\uC694"), /*#__PURE__*/
      React.createElement("i", { className: "fa-solid fa-sort-down relative top-[-3px]" })),


      value: 1 }), /*#__PURE__*/

    React.createElement(Tab, {
      className: "flex-grow !max-w-[none] px-4",
      label: /*#__PURE__*/
      React.createElement("span", { className: "flex items-baseline" }, /*#__PURE__*/
      React.createElement("i", { className: "fa-solid fa-pen mr-2" }), /*#__PURE__*/
      React.createElement("span", { className: "mr-2 whitespace-nowrap" }, "\uC791\uC131\uC21C"), /*#__PURE__*/
      React.createElement("i", { className: "fa-solid fa-sort-up relative top-[3px]" })),


      value: 2 }), /*#__PURE__*/

    React.createElement(Tab, {
      className: "flex-grow !max-w-[none] px-4",
      label: /*#__PURE__*/
      React.createElement("span", { className: "flex items-baseline" }, /*#__PURE__*/
      React.createElement("i", { className: "fa-solid fa-pen mr-2" }), /*#__PURE__*/
      React.createElement("span", { className: "mr-2 whitespace-nowrap" }, "\uC791\uC131\uC21C"), /*#__PURE__*/
      React.createElement("i", { className: "fa-solid fa-sort-down relative top-[-3px]" })),


      value: 3 })), /*#__PURE__*/


    React.createElement("div", { className: "p-5 sm:p-10" },
    sortedTodos.map((el, index) => /*#__PURE__*/
    React.createElement(TodoListItem, {
      key: index,
      todo: el,
      drawer: drawerStatus,
      toggleCheckBox: todosStatus.toggleCheckBox })))));





}

function TodoListItem({ todo, drawer, toggleCheckBox }) {
  return /*#__PURE__*/(
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("div", { className: "flex gap-1 py-3" }, /*#__PURE__*/
    React.createElement(Chip, {
      label: `No.${todo.id}`,
      variant: "contained",
      color: "primary",
      className: "!pt-1" }), /*#__PURE__*/

    React.createElement(Chip, {
      label: new Date(todo.performDate).toLocaleString(),
      variant: "outlined",
      className: "!pt-1" })), /*#__PURE__*/


    React.createElement("div", { className: "flex items-center !rounded-2xl shadow mb-3 sm:mb-6" }, /*#__PURE__*/
    React.createElement(Button, {
      className: "!rounded-l-2xl flex-shrink-0 flex !items-start",
      color: "inherit",
      onClick: () => toggleCheckBox(todo.id) }, /*#__PURE__*/

    React.createElement("span", {
      className: classNames(
      "text-3xl",
      "sm:text-4xl",
      "h-[60px]",
      "sm:h-[80px]",
      "flex",
      "items-center",
      { "text-[#dcdcdc]": todo.checked !== true },
      {
        "text-[color:var(--mui-color-primary-main)]":
        todo.checked === true }) }, /*#__PURE__*/



    React.createElement("i", { className: "fa-solid fa-check" }))), /*#__PURE__*/


    React.createElement("div", { className: "w-[2px] bg-[#dcdcdc] mr-3 my-4 sd:mr-4 sm:my-5" }), /*#__PURE__*/
    React.createElement("div", { className: "flex-grow whitespace-pre-wrap leading-loose !my-3 flex items-center text-[14px] sm:text-[16px]" },
    todo.content), /*#__PURE__*/

    React.createElement(Button, {
      className: "!rounded-r-2xl flex-shrink-0 flex !items-start",
      color: "inherit",
      onClick: () => drawer.open(todo.id) }, /*#__PURE__*/

    React.createElement("span", { className: "text-2xl sm:text-3xl h-[60px] sm:h-[80px] flex items-center text-[#dcdcdc]" }, /*#__PURE__*/
    React.createElement("i", { className: "fa-solid fa-ellipsis-vertical" }))))));





}

// ## 메인 페이지 시작
function MainPage() {
  const todosStatus = useTodosStatus();
  if (todosStatus.todos.length === 0) return /*#__PURE__*/React.createElement(TodosEmpty, null);

  return /*#__PURE__*/(
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement(TodoList, null)));


}

// ## 글쓰기 페이지 시작
function WritePage() {
  const todosStatus = useTodosStatus();
  const snackbarStatus = useSnackBarStatus();

  const onSubmit = e => {
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
  return /*#__PURE__*/(
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("form", {
      className: "flex flex-col gap-3 sm:gap-5 flex-1 p-5 sm:p-10",
      onSubmit: onSubmit }, /*#__PURE__*/

    React.createElement(TextField, {
      name: "performDate",
      label: "\uC5B8\uC81C \uD574\uC57C \uD558\uB098\uC694?",
      focused: true,
      type: "datetime-local" }), /*#__PURE__*/

    React.createElement(TextField, {
      name: "content",
      label: "\uBB34\uC5C7\uC744 \uD574\uC57C \uD558\uB098\uC694?",
      type: "text",
      className: "flex-1",
      multiline: true,
      InputProps: { className: "flex-1 flex-col" } }), /*#__PURE__*/

    React.createElement(Button, { variant: "contained", type: "submit" }, /*#__PURE__*/
    React.createElement("span", { className: "pt-1" }, "\u2795\xA0\uD560\uC77C \uCD94\uAC00")))));




}

function EditPage() {
  const { id } = useParams();
  const todosStatus = useTodosStatus();
  const snackbarStatus = useSnackBarStatus();

  const navigate = useNavigate();

  const onSubmit = e => {
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
  const beforeTodo = todosStatus.todos.find(el => el.id == id);
  const beforeRegDate = beforeTodo === null || beforeTodo === void 0 ? void 0 : beforeTodo.performDate;
  const beforeContent = beforeTodo === null || beforeTodo === void 0 ? void 0 : beforeTodo.content;

  return /*#__PURE__*/(
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("form", { className: "flex flex-col gap-5 flex-1 p-10", onSubmit: onSubmit }, /*#__PURE__*/
    React.createElement(TextField, {
      name: "performDate",
      label: "\uC5B8\uC81C \uD574\uC57C \uD558\uB098\uC694?",
      focused: true,
      type: "datetime-local",
      defaultValue: beforeRegDate }), /*#__PURE__*/

    React.createElement(TextField, {
      name: "content",
      label: "\uBB34\uC5C7\uC744 \uD574\uC57C \uD558\uB098\uC694?",
      type: "text",
      className: "flex-1",
      multiline: true,
      InputProps: { className: "flex-1 flex-col" },
      defaultValue: beforeContent }), /*#__PURE__*/

    React.createElement(Button, { variant: "contained", type: "submit" }, /*#__PURE__*/
    React.createElement("span", { className: "pt-1" }, "\u270F\uFE0F\xA0\uD560\uC77C \uC218\uC815 ")))));




}

// # 앱 세팅
function App() {
  const location = useLocation();
  const navigate = useNavigate();

  return /*#__PURE__*/(
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement(AppBar, { position: "fixed" }, /*#__PURE__*/
    React.createElement(Toolbar, null, /*#__PURE__*/
    React.createElement("div", { className: "flex-grow-0 sm:flex-1" }), /*#__PURE__*/
    React.createElement(NavLink, {
      to: "/main",
      className: "font-bold select-none cursor-pointer self-stretch flex items-center" }, "\uD83D\uDC30 Jini\u2019s To-Do \uD83D\uDC30"), /*#__PURE__*/



    React.createElement("div", { className: "flex-grow" }), /*#__PURE__*/
    React.createElement("div", { className: "self-stretch flex items-center" },
    location.pathname == "/main" && /*#__PURE__*/
    React.createElement(NavLink, {
      className: "select-none self-stretch flex items-center",
      to: "/write" }, "\uD560\uC77C \uCD94\uAC00"),




    location.pathname != "/main" && /*#__PURE__*/
    React.createElement("button", {
      onClick: () => navigate(-1),
      className: "select-none self-stretch flex items-center" }, "\uC774\uC804")))), /*#__PURE__*/







    React.createElement(Toolbar, null), /*#__PURE__*/
    React.createElement(SnackBar, null), /*#__PURE__*/
    React.createElement(Routes, null, /*#__PURE__*/
    React.createElement(Route, { path: "/main", element: /*#__PURE__*/React.createElement(MainPage, null) }), /*#__PURE__*/
    React.createElement(Route, { path: "/write", element: /*#__PURE__*/React.createElement(WritePage, null) }), /*#__PURE__*/
    React.createElement(Route, { path: "/edit/:id", element: /*#__PURE__*/React.createElement(EditPage, null) }), /*#__PURE__*/
    React.createElement(Route, { path: "*", element: /*#__PURE__*/React.createElement(Navigate, { to: "/main" }) }))));



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
"warning"];


function Root() {
  const theme = createTheme({
    typography: {
      fontFamily: ["GmarketSansMedium"] },

    palette: {
      primary: {
        main: "#FFF2B2",
        light: "#FFF4C1",
        dark: "#B2A97C",
        contrastText: "#010101" },

      secondary: {
        main: "#B2A97C",
        light: "#F8D8DF",
        dark: "#AC9097",
        contrastText: "#000000" } } });




  useEffect(() => {
    const r = document.querySelector(":root");

    muiThemePaletteKeys.forEach(paletteKey => {
      const themeColorObj = theme.palette[paletteKey];

      for (const key in themeColorObj) {
        if (Object.hasOwnProperty.call(themeColorObj, key)) {
          const colorVal = themeColorObj[key];
          r.style.setProperty(`--mui-color-${paletteKey}-${key}`, colorVal);
        }
      }
    });
  }, []);

  return /*#__PURE__*/(
    React.createElement(RecoilRoot, null, /*#__PURE__*/
    React.createElement(Router, null, /*#__PURE__*/
    React.createElement(ThemeProvider, { theme: theme }, /*#__PURE__*/
    React.createElement(CssBaseline, null), /*#__PURE__*/
    React.createElement(App, null)))));




}

ReactDOM.render( /*#__PURE__*/React.createElement(Root, null), document.getElementById("root"));
// # 앱 세팅 끝