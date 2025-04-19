--
-- PostgreSQL database cluster dump
--

-- Started on 2025-04-19 11:25:23

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.0

-- Started on 2025-04-19 11:25:23

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Completed on 2025-04-19 11:25:23

--
-- PostgreSQL database dump complete
--

--
-- Database "produto_db" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.0

-- Started on 2025-04-19 11:25:23

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4919 (class 1262 OID 16388)
-- Name: produto_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE produto_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'pt-BR';


ALTER DATABASE produto_db OWNER TO postgres;

\connect produto_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16390)
-- Name: loja; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loja (
    id integer NOT NULL,
    descricao character varying(60) NOT NULL
);


ALTER TABLE public.loja OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16389)
-- Name: loja_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loja_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loja_id_seq OWNER TO postgres;

--
-- TOC entry 4920 (class 0 OID 0)
-- Dependencies: 217
-- Name: loja_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loja_id_seq OWNED BY public.loja.id;


--
-- TOC entry 220 (class 1259 OID 16397)
-- Name: produto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produto (
    id integer NOT NULL,
    descricao character varying(60) NOT NULL,
    custo numeric(13,3),
    imagem bytea
);


ALTER TABLE public.produto OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16396)
-- Name: produto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produto_id_seq OWNER TO postgres;

--
-- TOC entry 4921 (class 0 OID 0)
-- Dependencies: 219
-- Name: produto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produto_id_seq OWNED BY public.produto.id;


--
-- TOC entry 222 (class 1259 OID 16406)
-- Name: produto_loja; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produto_loja (
    id integer NOT NULL,
    "precoVenda" numeric(13,3) NOT NULL,
    "produtoId" integer,
    "lojaId" integer
);


ALTER TABLE public.produto_loja OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16405)
-- Name: produto_loja_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produto_loja_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produto_loja_id_seq OWNER TO postgres;

--
-- TOC entry 4922 (class 0 OID 0)
-- Dependencies: 221
-- Name: produto_loja_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produto_loja_id_seq OWNED BY public.produto_loja.id;


--
-- TOC entry 4752 (class 2604 OID 16393)
-- Name: loja id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loja ALTER COLUMN id SET DEFAULT nextval('public.loja_id_seq'::regclass);


--
-- TOC entry 4753 (class 2604 OID 16400)
-- Name: produto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto ALTER COLUMN id SET DEFAULT nextval('public.produto_id_seq'::regclass);


--
-- TOC entry 4754 (class 2604 OID 16409)
-- Name: produto_loja id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto_loja ALTER COLUMN id SET DEFAULT nextval('public.produto_loja_id_seq'::regclass);


--
-- TOC entry 4909 (class 0 OID 16390)
-- Dependencies: 218
-- Data for Name: loja; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loja (id, descricao) FROM stdin;
1	Loja 1
2	Loja 2
3	Loja 3
\.


--
-- TOC entry 4911 (class 0 OID 16397)
-- Dependencies: 220
-- Data for Name: produto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produto (id, descricao, custo, imagem) FROM stdin;
\.


--
-- TOC entry 4913 (class 0 OID 16406)
-- Dependencies: 222
-- Data for Name: produto_loja; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produto_loja (id, "precoVenda", "produtoId", "lojaId") FROM stdin;
\.


--
-- TOC entry 4923 (class 0 OID 0)
-- Dependencies: 217
-- Name: loja_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loja_id_seq', 3, true);


--
-- TOC entry 4924 (class 0 OID 0)
-- Dependencies: 219
-- Name: produto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produto_id_seq', 4, true);


--
-- TOC entry 4925 (class 0 OID 0)
-- Dependencies: 221
-- Name: produto_loja_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produto_loja_id_seq', 1, false);


--
-- TOC entry 4756 (class 2606 OID 16395)
-- Name: loja loja_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loja
    ADD CONSTRAINT loja_pkey PRIMARY KEY (id);


--
-- TOC entry 4760 (class 2606 OID 16411)
-- Name: produto_loja produto_loja_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto_loja
    ADD CONSTRAINT produto_loja_pkey PRIMARY KEY (id);


--
-- TOC entry 4758 (class 2606 OID 16404)
-- Name: produto produto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto
    ADD CONSTRAINT produto_pkey PRIMARY KEY (id);


--
-- TOC entry 4761 (class 2606 OID 16429)
-- Name: produto_loja FK_0b1e3aa46421a6a521d289d52f5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto_loja
    ADD CONSTRAINT "FK_0b1e3aa46421a6a521d289d52f5" FOREIGN KEY ("lojaId") REFERENCES public.loja(id);


--
-- TOC entry 4762 (class 2606 OID 16424)
-- Name: produto_loja FK_84c13cc1bf1aa417ace35f3abf2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto_loja
    ADD CONSTRAINT "FK_84c13cc1bf1aa417ace35f3abf2" FOREIGN KEY ("produtoId") REFERENCES public.produto(id);


-- Completed on 2025-04-19 11:25:23

--
-- PostgreSQL database dump complete
--

-- Completed on 2025-04-19 11:25:23

--
-- PostgreSQL database cluster dump complete
--

