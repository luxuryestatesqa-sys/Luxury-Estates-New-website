-- Remove the original placeholder/demo off-plan projects now that real
-- client-supplied inventory (OP-2006 onward) has replaced them.
delete from public.off_plan_projects
where reference in ('OP-2001', 'OP-2002', 'OP-2003', 'OP-2004', 'OP-2005');
