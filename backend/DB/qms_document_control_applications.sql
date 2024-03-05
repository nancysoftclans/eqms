-- Table: public.tra_psur_pbrer_applications

-- DROP TABLE IF EXISTS public.tra_psur_pbrer_applications;
CREATE SEQUENCE qms_document_control_applications_seq;
ALTER SEQUENCE qms_document_control_applications_seq restart with 1;
CREATE TABLE IF NOT EXISTS public.qms_document_control_applications
(
    id integer NOT NULL DEFAULT nextval('qms_document_control_applications_seq'::regclass),
    /**
	Generic Fields
	**/
	module_id integer,
    sub_module_id integer,
	application_code bigint,
    process_id integer,
   	tracking_no character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    reference_no character varying(255) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    /**
	Data fields
	**/
	document_id character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
	document_title character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
	document_version character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
	document_description character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
	related_document character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
	navigation_folder_id integer,
	
	/**
	Submission Details
	**/	
	date_added timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    submission_date timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    application_status_id integer,
    created_on timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    dola timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    altered_by character varying(145) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    created_by character varying(145) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
   	view_id character varying COLLATE pg_catalog."default",
    section_id integer,
    workflow_stage_id integer,
    remarks text COLLATE pg_catalog."default",
    reg_serial character varying COLLATE pg_catalog."default",
    from_date date,
    to_date date,
    CONSTRAINT qms_document_control_applications_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.qms_document_control_applications
    OWNER to postgres;

INSERT INTO "par_modules" ("id", "name", "description", "icons", "invoice_desc", "tablename", "portaltable_name", "cancellation_table_name", "reg_column_id", "code", "created_on", "created_by", "dola", "altered_by", "is_enabled", "is_application", "modhas_payment_processing") VALUES (25, 'PSUR and PBRER', 'PSUR and PBRER', NULL, NULL, 'tra_psur_pbrer_applications', 'wb_psur_pbrer_applications', NULL, NULL, NULL, '2023-08-08 14:56:35.981203', NULL, '2023-08-08 14:56:35.981203', NULL, 1, 1, 1);
INSERT INTO "par_sub_modules" ("id", "module_id", "name", "description", "title", "action_title", "code", "icon", "created_on", "created_by", "dola", "altered_by", "is_enabled", "has_payment_processing", "has_invoice_generation", "is_orderlocal_supply") VALUES (367, 26, 'document control', NULL, 'document control', NULL, NULL, NULL, '2024-03-04 10:57:41', 1, '2024-03-04 11:57:41.622256', NULL, 1, 2, 2, NULL);

