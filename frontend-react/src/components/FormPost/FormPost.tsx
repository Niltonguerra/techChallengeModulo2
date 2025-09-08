

import React, { useEffect, useState } from 'react';
import { Box, Paper, TextField, Button, Typography, MenuItem } from '@mui/material';
import { useFormPostSubmit } from '../../hooks/useFormPostSubmit';
import type { FormPostData, LinkItem } from '../../types/form-post';
import DynamicLinksInput from './DynamicLinksInput';
import ImageUpload from './ImageUpload';
import './FormPost.scss';
import { initialState } from '../../constants/formConstants';

const FormPost: React.FC<Partial<FormPostData>> = (props) => {
	const [form, setForm] = useState<FormPostData>({
		...initialState,
		...props,
		content_hashtags: props.content_hashtags ?? [],
	});

	const isEdit = Boolean(props.id);
	const formTitle = isEdit ? 'Editar Post' : 'Criar Post';
	const [links, setLinks] = useState<LinkItem[]>([]);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});

		useEffect(() => {
			setForm((prev) => ({
				...prev,
				...props,
				content_hashtags: props.content_hashtags ?? [],
			}));
			if (props.image && typeof props.image === 'string') {
				setImagePreview(props.image);
			} else {
				setImagePreview(null);
			}
		}, [props]);

	const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}, []);

	const handleArrayChange = React.useCallback(
		(key: keyof FormPostData, idx: number, value: string) => {
			setForm((prev) => ({
				...prev,
				[key]: (prev[key] as string[]).map((item, i) => (i === idx ? value : item)),
			}));
		},
	[]
	);

	const handleArrayAdd = React.useCallback((key: keyof FormPostData) => {
		setForm((prev) => ({
			...prev,
			[key]: [...((prev[key] as string[]) ?? []), ''],
		}));
	}, []);

	const handleArrayRemove = React.useCallback((key: keyof FormPostData, idx: number) => {
		setForm((prev) => ({
			...prev,
			[key]: (prev[key] as string[]).filter((_, i) => i !== idx),
		}));
	}, []);

	const handleHashtagChange = (idx: number, value: string) => handleArrayChange('content_hashtags', idx, value);
	const handleAddHashtag = () => handleArrayAdd('content_hashtags');
	const handleRemoveHashtag = (idx: number) => handleArrayRemove('content_hashtags', idx);
	const handleLinksChange = React.useCallback((newLinks: LinkItem[]) => setLinks(newLinks), []);
	const handleImage = React.useCallback((file: File | null) => setForm((prev) => ({ ...prev, image: file })), []);
	const { handleSubmit } = useFormPostSubmit({ form, author_id:'c2d5d52a-e8d4-4db2-9100-647b0ef515f6', links, setErrors });

		return (
			<Box className="form-post-container">
				<Paper elevation={3} className="form-post-paper">
					<Typography variant="h4" component="h2" className="form-post-title">
						{formTitle}
					</Typography>
					<form onSubmit={handleSubmit} className="form-post-form">
						<ImageUpload
							image= {form.image}
							onChange={handleImage}
							preview={imagePreview}
							setPreview={setImagePreview}
							error={errors.image}
						/>
						<TextField
							label="Título"
							name="title"
							value={form.title}
							onChange={handleChange}
							required
							fullWidth
							error={!!errors.title}
							helperText={errors.title}
						/>

						<TextField
							label="Introdução"
							name="introduction"
							value={form.introduction}
							onChange={handleChange}
							required
							fullWidth
							multiline
							minRows={2}
							error={!!errors.introduction}
							helperText={errors.introduction}
						/>
						<DynamicLinksInput links={links} onChange={handleLinksChange} error={errors.external_link} />
						<div className="form-post-hashtags">
							<Typography variant="subtitle1" className="form-post-label">Hashtags</Typography>
							{form.content_hashtags.map((hashtag, idx) => (
								<div className="form-post-hashtag-row" key={idx}>
									<TextField
										label={`Hashtag #${idx + 1}`}
										value={hashtag}
										onChange={e => handleHashtagChange(idx, e.target.value)}
										error={!!errors.content_hashtags}
										helperText={idx === 0 && errors.content_hashtags}
										fullWidth
									/>
									<Button
										onClick={() => handleRemoveHashtag(idx)}
										color="error"
										variant="outlined"
										className="form-post-remove-btn"
										disabled={form.content_hashtags.length === 1}
									>
										Remover
									</Button>
								</div>
							))}
							<Button onClick={handleAddHashtag} variant="outlined" color="primary" className="form-post-add-btn">
								Adicionar hashtag
							</Button>
						</div>
						<TextField
							select
							label="Estilo"
							name="style_id"
							value={form.style_id}
							onChange={handleChange}
							required
							fullWidth
							error={!!errors.style_id}
							helperText={errors.style_id}
						>
							<MenuItem value="">Selecione um estilo</MenuItem>
							<MenuItem value="claro">Claro</MenuItem>
							<MenuItem value="escuro">Escuro</MenuItem>
							<MenuItem value="colorido">Colorido</MenuItem>
							<MenuItem value="minimalista">Minimalista</MenuItem>
						</TextField>
						<TextField
							label="Descrição"
							name="description"
							value={form.description}
							onChange={handleChange}
							required
							fullWidth
							multiline
							minRows={2}
							error={!!errors.description}
							helperText={errors.description}
						/>
						<Button type="submit" variant="contained" color="primary" size="large" className="form-post-submit">
							Enviar
						</Button>
					</form>
				</Paper>
			</Box>
		);
};

export default FormPost;
