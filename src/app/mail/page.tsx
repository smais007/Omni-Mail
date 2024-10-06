import React from "react";
import Mail from "./_components/mail";

const MailDashboard = () => {
  return (
    <div>
      <Mail
        defaultCollapsed={false}
        defaultLayout={[20, 32, 48]}
        navCollapseSize={15}
      />
    </div>
  );
};

export default MailDashboard;
