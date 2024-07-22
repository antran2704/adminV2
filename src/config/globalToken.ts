import { ThemeConfig } from "antd";
import { ComponentToken as SegmentedComponentToken } from "antd/es/segmented/style";
import { ComponentToken as SelectComponentToken } from "antd/es/select/style";
import { ComponentToken as TableComponentToken } from "antd/es/table/style";

const styleSegment: Partial<SegmentedComponentToken> = {
  itemSelectedBg: "#009883",
  itemSelectedColor: "white",
};

const styleSelect: Partial<SelectComponentToken> = {
  optionFontSize: 16,
  optionPadding: "6px 12px",
  optionSelectedBg: "#009883",
  optionSelectedColor: "white",
};

const styleTable: Partial<TableComponentToken> = {
  //   borderColor: "transparent",
  headerBg: "#3784FB",
  headerColor: "white",
  headerBorderRadius: 0,
  headerSplitColor: "transparent",
};

const configGlobalAntd: ThemeConfig = {
  components: {
    Segmented: styleSegment,
    Select: styleSelect,
    Table: styleTable,
  },
};

export default configGlobalAntd;
