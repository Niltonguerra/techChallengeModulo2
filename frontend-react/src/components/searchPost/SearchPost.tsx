// general imports
import React, { useEffect, useReducer, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Box, Button, Fade, IconButton, InputAdornment, MenuItem, Modal, OutlinedInput, Select, Stack, TextField, Typography } from '@mui/material';
import  { Dayjs } from 'dayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from '@mui/icons-material/Close';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { fetchPosts, getHashtags } from '../../service/post';
import "./search.scss";
import { useSearchSubmit } from '../../hooks/useSearchSubmit';
import { getAuthors } from '../../service/user';
import type { State, Action } from '../../types/search-post';


function reducer(state: State, action: Action): State {
  return {
    ...state,
    [action.field]: action.value,
  };
}

export default function SearchPost() {
  const [state, dispatch] = useReducer(reducer, {
    postSearch: '',
    postAuthor: null,
    postContent: null,
    createdAtBefore: null,
    createdAtAfter: null,
  });
  const [debouncedSearch] = useDebounce(state.postSearch || '', 400);
  const [contentOptions, setContentOptions] = useState<string[]>([]);
  const [authorPostsOptions, setAuthorPostsOptions] = useState<{ id: string; name: string }[]>([]);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const { handleFetchAdvanced } = useSearchSubmit(fetchPosts);
  const offset = "0";
  const limit = "20";

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

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [contentResponse, authorResponse] = await Promise.all([
          getHashtags(),
          getAuthors().catch(() => ({ data: [] })),
        ]);

        setContentOptions(contentResponse.data || []);
        setAuthorPostsOptions(authorResponse?.data?.data || []);
      } catch (err: Error | unknown) {
        console.error('error while getting filter options: ', err);
      }
    };
    fetchFilterOptions();
  }, []);

  return (
    <>
      <Box className="post-search">
        <OutlinedInput
          value={state.postSearch}
          onChange={(e) => dispatch({ field: "postSearch", value: e.target.value })}
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
            borderRadius: "4px",
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
            borderRadius: "4px",
            textTransform: "uppercase",
            fontWeight: 700,
            paddingX: 2.5,
            height: 40,
            width: { xs: "100%", sm: 200 },
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
            <Box className="box_style_search">
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 1 }}>
                <Typography id="filters-title" variant="h6">Filtros avançados</Typography>
                <IconButton onClick={() => setAdvancedFiltersOpen(false)} aria-label="Fechar">
                  <CloseIcon />
                </IconButton>
              </Box>

              <Typography id="filters-desc" sx={{ marginBottom: 2, color: "text.secondary" }}>
                Preencha os filtros abaixo para refinar sua busca
              </Typography>
              <Stack spacing={2}>
                <TextField
                  size="small"
                  fullWidth
                  label="Busca (Título, descrição, etc.)"
                  value={state.postSearch}
                  onChange={(e) => dispatch({ field: "postSearch", value: e.target.value })}
                />
                <Select
                  onChange={(e) => dispatch({ field: "postContent", value: e.target.value })}
                  value={state.postContent || ''}
                  displayEmpty={true}
                  renderValue={(selected: string) => {
                    if (!selected) {
                      return <span style={{ color: "#888" }}>Matéria</span>;
                    }
                    return selected;
                  }}
                >
                  <MenuItem value="">Selecione</MenuItem>
                  {contentOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  onChange={(e) => dispatch({ field: "postAuthor", value: e.target.value })}
                  value={state.postAuthor || ''}
                  displayEmpty={true}
                  renderValue={(selected: string) => {
                    if (!selected) {
                      return <span style={{ color: "#888" }}>Autor</span>;
                    }
                    const author = authorPostsOptions.find((opt) => opt.id === selected);
                    return author ? author.name : selected;
                  }}
                >
                  <MenuItem value="">Selecione</MenuItem>
                  {authorPostsOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <DatePicker
                    label="De: "
                    value={state.createdAtBefore}
                    onChange={(newValue) => dispatch({ field: "createdAtBefore", value: newValue })}
                    format='DD/MM/YYYY'
                  />
                  <DatePicker
                    label="Até: "
                    value={state.createdAtAfter}
                    onChange={(newValue) => dispatch({ field: "createdAtAfter", value: newValue })}
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
                    dispatch({ field: "createdAtBefore", value: null });
                    dispatch({ field: "createdAtAfter", value: null });
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
