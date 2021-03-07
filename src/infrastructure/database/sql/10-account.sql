CREATE TABLE public.account (
    id uuid NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    status text NOT NULL,
    registration_date timestamp WITH time zone NOT NULL,
    confirmation_date timestamp WITH time zone
);

ALTER TABLE public.account OWNER TO root;

ALTER TABLE public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);

