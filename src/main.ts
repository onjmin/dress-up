import "./style.css";
import { DressUpApp } from "./ui/app";

const root = document.getElementById("app");
if (root) {
	new DressUpApp(root);
}
