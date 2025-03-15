import React from "react";

const Heading = ( { title, description, ...props } ) =>
{
  return (
    <div {...props}>
      <h2
        className="text-3xl font-bold tracking-tight"
        data-testid="heading-title"
      >
        {title}
      </h2>
      <p
        className="text-sm text-muted-foreground"
        data-testid="heading-description"
      >
        {description}
      </p>
    </div>
  );
};

export default Heading;
