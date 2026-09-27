import { danger } from "danger";
import * as rules from "./danger-rules.ts";

Object.values(rules).forEach((rule) => rule.check(danger));
