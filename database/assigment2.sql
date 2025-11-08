--Data to be inserted in account table
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
  )
VALUES (
	'Tony',
	'Stark',
	'tony@stark.com',
	'Iam1ronM@n'
);

--Updating account type for Tony Stark to Admin
UPDATE public.account SET account_type = 'Admin' 
WHERE account_firstname = 'Tony';

--Delete Tony Stark user
DELETE FROM public.account WHERE account_firstname = 'Tony';

--Update the GM Hummer description
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interiors')
	WHERE inv_id = 10

--Join query
SELECT public.inventory.inv_make,
       public.inventory.inv_model,
       public.classification.classification_name
FROM public.inventory
INNER JOIN public.classification
    ON public.inventory.classification_id = public.classification.classification_id
WHERE public.classification.classification_name = 'Sport';

-- Update all records in the inventory to add /vehicles in image paths
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');