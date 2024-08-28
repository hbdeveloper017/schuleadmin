// ** Third Party Components

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

import { Chart } from "react-google-charts";
import { MoreVertical } from "react-feather";

// ** Reactstrap Imports

const ChartjsPolarAreaChart = (props) => {
  // ** Chart Data
  const chartData = [
    ["Task", "Hours per Day"],
    ["Sehr gut", props.chartData["Sehr gut"]],
    ["Gut", props.chartData["Gut"]],
    ["Befriedigend", props.chartData["Befriedigend"]],
    ["Ausreichend", props.chartData["Ausreichend"]],
    ["Mangelhaft", props.chartData["Mangelhaft"]],
    ["Ungenügend", props.chartData["Ungenügend"]],
  ];

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
        <CardTitle tag="h4" style={{ fontSize: 16, color: "#000" }}>
          {props.label}
        </CardTitle>
        {/* <UncontrolledDropdown>
          <DropdownToggle className="cursor-pointer" tag="span">
            <MoreVertical size={14} />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem className="w-100">Last 28 days</DropdownItem>
            <DropdownItem className="w-100">Last Month</DropdownItem>
            <DropdownItem className="w-100">Last Year</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown> */}
      </CardHeader>
      <CardBody className="d-flex justify-content-between align-items-center pe-4">
        <div style={{ height: "280px", width: "300px" }}>
          <Chart
            chartType="PieChart"
            data={chartData}
            options={{
              title: "",
              legend: "none",
              pieSliceText: "none",
              slices: {
                0: { color: "#5BCA49" },
                1: { color: "#99CA49" },
                2: { color: "#CABD49" },
                3: { color: "#FFA132" },
                4: { color: "#FF7714" },
                5: { color: "#E93016" },
              },
            }}
            width={"100%"}
            height={"260px"}
          />
        </div>
        <div className="labelInfo">
          <p>
            <span style={{ background: "#5BCA49" }} />
            Sehr gut
          </p>
          <p>
            <span style={{ background: "#99CA49" }} />
            Gut
          </p>
          <p>
            <span style={{ background: "#CABD49" }} />
            Befriedigend
          </p>
          <p>
            <span style={{ background: "#FFA132" }} />
            Ausreichend
          </p>
          <p>
            <span style={{ background: "#FF7714" }} />
            Mangelhaft
          </p>
          <p>
            <span style={{ background: "#E93016" }} />
            Ungenügend
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default ChartjsPolarAreaChart;
