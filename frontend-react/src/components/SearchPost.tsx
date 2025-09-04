// general imports
import React, { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Box, Button, Fade, IconButton, InputAdornment, MenuItem, Modal, OutlinedInput, Select, Stack, TextField, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// icons
import CloseIcon from '@mui/icons-material/Close';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';

// types
import type { Post, PostSearch } from '../types/post';
import { getApi } from '../service/api';

export default function SearchPost() {
	const modalStyle = { //<< todo: make it the standard for other modals (?)
		position: "absolute" as const,
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: { xs: "90%", sm: 520 },
		bgcolor: "background.paper",
		borderRadius: 2,
		boxShadow: 24,
		padding: 3,
		outline: "none",
	};

	const isDevMode = true; //<< remove this later (?)
	const api = getApi(); // one stable instance

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [postList, setPostList] = useState<Post[]>([]); //<< todo: change it for the redux.

	// advanced filters inputs
  const [postSearch, setPostSearch] = useState('');
	const [postAuthor, setPostAuthor] = useState<string | null>(null);
	const [postContent, setPostContent] = useState<string | null>(null);
	const [createdAtBefore, setCreatedAtBefore] = useState<Dayjs | null>(null);
	const [createdAtAfter, setCreatedAtAfter] = useState<Dayjs | null>(null);

	// dynamic search bar input
  const [debouncedSearch] = useDebounce(postSearch || '', 400); // 400ms delay

	// advanced filters select options
  const [contentOptions, setContentOptions] = useState<string[]>([]);
	const [authorPostsOptions, setAuthorPostsOptions] = useState<{_id: string; name: string}[]>([]);

	const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

	// const api = axios.create({ baseURL: "http://localhost:3000" });

	//<< obs/todo: if we implement pagination or infinite scroll, these gonna have to be in redux too
	const offset = 0;
	const limit = 20;

	const fetchPosts = useCallback(async (props: PostSearch) => {
		const {
			advanced = false,
			signal,
			search,
			userId,
			content,
			createdAt,
			offset,
			limit,
		} = props;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let params: Record<string, any> = {
			search: advanced ? search : search ?? null,
			offset,
			limit,
		};

		if (advanced) {
			params = {
				...params,
				userId: userId ?? null,
				content: content ?? null,
				createdAt: createdAt ?? null,
			};
		}

		const { data } = await api.get<Post[]>('/posts/search', {
			params,
			signal,
		});
		setPostList(data);
	}, [api]);

	// search field search
	useEffect(() => {

		const controller = new AbortController();
		fetchPosts({
			advanced: false,
			search: debouncedSearch || null,
			offset,
			limit,
			signal: controller.signal,
		});

		return () => controller.abort();
	}, [debouncedSearch, offset, limit, fetchPosts]);

	const handleFetchAdvanced = () => {
		const controller = new AbortController();
		fetchPosts({
			advanced: true,
			search: postSearch || null,
			userId: postAuthor || null,
			content: postContent || null,
			createdAt: {
				before: createdAtBefore ? createdAtBefore.toDate() : null,
				after: createdAtAfter ? createdAtAfter.toDate() : null,
			},
			offset,
			limit,
			signal: controller.signal,
		});
	};

	// getting the options for advanced filters
	useEffect(() => {
		const fetchFilterOptions = async () => {
			try {
				let contentResponse, authorResponse;

				if(!isDevMode) {
					[contentResponse, authorResponse] = await Promise.all([
						api.get('/posts/content-options'),
						api.get('/posts/author-options'),
					]);

					setContentOptions(contentResponse.data);
					setAuthorPostsOptions(authorResponse.data);
					// if we are in dev, just get a mock
				} else {
					contentResponse = ['Matemática', 'Português', 'Química', 'Biologia', 'História', 'Educação Física', 'Inglês', 'Artes', 'Física', 'Geografia'];
					authorResponse = [
						{_id: '1', name: 'Ana Beatriz'}, 
						{_id: '2', name: 'Carlos Eduardo'}, 
						{_id: '3', name: 'Mariana Silva'}, 
						{_id: '4', name: 'Pedro Henrique'}, 
						{_id: '5', name: 'Juliana Costa'}
					];

					setContentOptions(contentResponse);
					setAuthorPostsOptions(authorResponse);
				}

				
			} catch (err: Error | unknown) {
				console.error('error while getting filter options: ', err);
			}
		};

		fetchFilterOptions();
	}, [api, isDevMode]);

  return (
		<>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "1fr auto",
					gap: 1.5,
					alignItems: "center",
					width: 720,  
				}}
			>
				<OutlinedInput
					value={postSearch}
					onChange={(e) => setPostSearch(e.target.value)}
					placeholder="Filtrar posts"
					fullWidth
					size="small"
					endAdornment={
						<InputAdornment position="end" sx={{ paddingRight: 1 }}>
							<SearchIcon fontSize="small" sx={{ opacity: 0.6, pointerEvents: "none" }} />
						</InputAdornment>
					}
					sx={{
						bgcolor: "#fff",
						borderRadius: '4px',
						"input": { paddingTop: 1.25, paddingX: 1.5 },
					}}
				/>

				<Button
					variant="contained"
					startIcon={<FilterAltOutlinedIcon />}
					onClick={() => setAdvancedFiltersOpen((prev) => !prev)}
					sx={{
						bgcolor: "#f47b20",
						"&:hover": { bgcolor: "#dd6d1d" },
						borderRadius: '4px',
						textTransform: "uppercase",
						fontWeight: 700,
						paddingX: 2.5,
						height: 40,
						width: 200
					}}
				>
					Filtros
				</Button>
			</Box>
			{advancedFiltersOpen && (
				<Modal
					open={advancedFiltersOpen}
					onClose={() => setAdvancedFiltersOpen(false)}
					closeAfterTransition
					slotProps={{ backdrop: { timeout: 250 } }}
					aria-labelledby="filters-title"
					aria-describedby="filters-desc"
				>
					<Fade in={advancedFiltersOpen}>
						<Box sx={modalStyle}>
							<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 1 }}>
								<Typography id="filters-title" variant="h6">Filtros avançados</Typography>
								<IconButton onClick={() => setAdvancedFiltersOpen(false)} aria-label="Fechar">
									<CloseIcon />
								</IconButton>
							</Box>

							<Typography id="filters-desc" sx={{ marginBottom: 2, color: "text.secondary" }}>
								Preencha os filtros abaixo para refinar sua busca
							</Typography>

							{/** filters: 
							 * 'search' (description, introduction, title, etc), 
							 * which teacher created it, 
							 * when it was created, 
							 * 'content_hashtags' 
							 * */}
							<Stack spacing={2}>
								<TextField 
									size="small" 
									fullWidth 
									label="Busca (Título, descrição, etc.)" 
									onChange={(e) => setPostSearch(e.target.value)}
								/>
								<Select 
								 	onChange={(e) => setPostContent(e.target.value)} 
								 	value={postContent || ''}
									displayEmpty={true}
									renderValue={(selected) => {
										if (!selected) {
											return <span style={{ color: "#888" }}>Matéria</span>;
										}
										return selected;
									}}
								>
									{/* empty option */}
									<MenuItem value="">
										Selecione
									</MenuItem>
									{contentOptions.map((option) => (
										<MenuItem key={option} value={option}>
											{option}
										</MenuItem>
									))}
								</Select>
								<Select 
								 onChange={(e) => setPostAuthor(e.target.value)} 
								 value={postAuthor || ''}
								 displayEmpty={true}
								 renderValue={(selected) => {
									if (!selected) {
										return <span style={{ color: "#888" }}>Autor</span>;
									}
										const author = authorPostsOptions.find((opt) => opt._id === selected);
										return author ? author.name : selected;
									}}
								>
									{/* empty option */}
									<MenuItem value="">
										Selecione
									</MenuItem>
									{authorPostsOptions.map((option) => (
										<MenuItem key={option._id} value={option._id}>
											{option.name}
										</MenuItem>
									))}
								</Select>
								<Stack direction="row" spacing={2} justifyContent="space-between">
									<DatePicker
										label="De: "
										value={createdAtBefore}
										onChange={(newValue: React.SetStateAction<dayjs.Dayjs | null>) => setCreatedAtBefore(newValue)}
										format='DD/MM/YYYY'
									/>
									<DatePicker
										label="Até: "
										value={createdAtAfter}
										onChange={(newValue: React.SetStateAction<dayjs.Dayjs | null>) => setCreatedAtAfter(newValue)}
										format='DD/MM/YYYY'
									/>
								</Stack>
								<Button
									variant="text"
									style={{
										fontSize: '0.8rem',
										padding: '4px 8px',
										marginRight: 'auto',
									}}
									onClick={() => {
										setCreatedAtBefore(null);
										setCreatedAtAfter(null);
									}}
								>
									Limpar datas
								</Button>
							</Stack>

							<Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ marginTop: 3 }}>
								<Button onClick={() => setAdvancedFiltersOpen(false)}>Cancelar</Button>
								<Button variant="contained" onClick={handleFetchAdvanced}>Aplicar</Button>
							</Stack>
						</Box>
					</Fade>
				</Modal>
			)}
		</>
  );
}