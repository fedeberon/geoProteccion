import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

const geozonesPageStyle = makeStyles((theme) => ({
  root: {
    overflowY: "scroll",
    height: "100%",
    overflowX: "hidden",
    paddingBottom: "15%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
      height: "100%",
      overflowY: "scroll",
      paddingTop: "5%",
      paddingRight: "15%",
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "90%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  appBar: {},
  [theme.breakpoints.up("md")]: {
    position: "relative",
  },
  title: {},
  [theme.breakpoints.up("md")]: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  imgItem: {
    display: "none",
  },
  [theme.breakpoints.up("md")]: {
    height: "100px",
    display: "block",
  },
  accordionStyle: {
    margin: "10px 0px",
  },
  [theme.breakpoints.up("md")]: {
    margin: "15px 0px",
    width: "50%",
  },
  heading: {
    fontSize: "12px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  attributesStyles: {
    fontSize: "11px",
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "50.33%",
  },
  [theme.breakpoints.up("md")]: {
    flexBasis: "33.33%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: "0px 16px",
    paddingLeft: "2%",
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  extendedIcon: {
    marginRight: "1px",
  },
  rootmodal: {
    "& > *": {
      width: "250px",
      margin: theme.spacing(1),
    },
    [theme.breakpoints.up("md")]: {
      "& > *": {
        width: "500px",
      },
    },
  },
  //Estilos modal map
  rootMap: {
    display: "flex",
  },
  appBarMap: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerMap: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaperMap: {
    width: drawerWidth,
  },
  drawerContainerMap: {
    overflow: "auto",
    marginTop: "5%",
  },
  contentMap: {
    flexGrow: 1,
    height: "100vh",
  },
  //Fin estilos modal map

  //Persistent Drawer Mobile
  rootPersistent: {
    display: "flex",
  },
  appBarPersistent: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  contentPer: {
    flexGrow: 1,
    height: "100vh",
    width: "100vh",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  //Persistent Drawer Mobile
}));

export default geozonesPageStyle;