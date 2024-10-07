import React from 'react';

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`bg-white shadow-lg rounded-lg ${className}`} {...props} />
));

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 ${className}`} {...props} />
));

export const CardTitle = React.forwardRef(({ className, children = 'Title', ...props }, ref) => (
  <h3 ref={ref} className={`text-2xl font-semibold ${className}`} {...props}>
    {children}
  </h3>
));

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));

export const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));