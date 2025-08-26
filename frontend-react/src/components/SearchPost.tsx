// general imports
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Box, Button, Fade, IconButton, InputAdornment, Menu, MenuItem, Modal, OutlinedInput, Select, Stack, TextField, Typography } from '@mui/material';
import axios from "axios";

// icons
import CloseIcon from '@mui/icons-material/Close';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';

// types
import type { Post } from '../types/post';

export default function SearchPost() {
	const modalStyle = { //<< todo: make it the standard for other modals
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

  const [postList, setPostList] = useState<Post[]>([]); //<< todo: change it for the redux.
  const [postSearch, setPostSearch] = useState('');
  const [debouncedSearch] = useDebounce(postSearch, 400); // espera 400ms

	const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

	const api = axios.create({ baseURL: "http://localhost:3000" });

	//<< obs/todo: if we implement pagination or infinite scroll, these gonna have to be in redux too
	const offset = 0;
	const limit = 20;

  useEffect(() => {
	// used to cancel out of date requests (ex: as the user types, only sends the request for the most recent one)
	const controller = new AbortController();

	const fetchPosts = async () => {
	  try {
			const { data } = await api.get('/posts', { //<< todo: replace with redux dispatch
				signal: controller.signal,
				params: {
				search: debouncedSearch || undefined,
				offset: 0,
				limit: 20,
				},
			});

			setPostList(data);

	  } catch (err: Error | unknown) {
			console.log('error while getting posts in search: ', err);
	  }
	};

	fetchPosts();

	return () => controller.abort();
  }, [debouncedSearch, offset, limit, api]);

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
								Ajuste os critérios abaixo e clique em Aplicar.
							</Typography>

							{/** filters: when it was created, which teacher created it, 'search' (description, introduction, title, etc), 'content_hashtags'(?) */}
							<Stack spacing={2}>
								<TextField size="small" fullWidth label="Busca (Título, descrição, etc.)" />
								<Select>
									<MenuItem value="1">1</MenuItem>
									<MenuItem value="2">2</MenuItem>
									<MenuItem value="3">3</MenuItem>
								</Select>
							</Stack>

							<Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ marginTop: 3 }}>
								<Button onClick={() => setAdvancedFiltersOpen(false)}>Cancelar</Button>
								<Button variant="contained" onClick={() => console.log('todo submit filters')}>Aplicar</Button>
							</Stack>
						</Box>
					</Fade>
				</Modal>
			)}
		</>
  );
}