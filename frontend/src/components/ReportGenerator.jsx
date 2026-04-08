import React from "react";

function ReportGenerator() {
  return (
    <div>
      <form action="#">
        <fieldset>
          <legend>Report Generator</legend>
          <div>
            <label htmlFor="reportRange">Date Range:</label><br />
            <input type="month" id="reportRange" name="reportRange" />
          </div>
          <div>
            <button type="submit">Generate Report</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default ReportGenerator;
