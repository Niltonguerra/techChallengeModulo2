import React, { useEffect, useState } from 'react';
import { Box, Paper, TextField, Button, Typography } from '@mui/material';
import { useFormPostSubmit } from '../../hooks/useFormPostSubmit';
import type { FormPostData} from '../../types/form-post';
import DynamicFieldsInput from './DynamicFieldsInput';
import ImageUpload from './ImageUpload';
import './FormPost.scss';
import { initialState } from '../../constants/formConstants';


const getInitialLinks = (external_link?: Record<string, string>) =>
	external_link && Object.keys(external_link).length > 0
		? Object.entries(external_link).map(([key, value]) => ({ key, value }))
		: [{ key: '', value: '' }];

const getInitialHashtags = (content_hashtags?: string[]) =>
	content_hashtags && content_hashtags.length > 0
		? content_hashtags.map(h => ({ key: '', value: h }))
		: [{ key: '', value: '' }];

const FormPost: React.FC<Partial<FormPostData>> = (props) => {
	const [form, setForm] = useState<FormPostData>({
		...initialState,
		...props,
		content_hashtags: props.content_hashtags ?? [],
	});

	const isEdit = Boolean(props.id);
	const formTitle = isEdit ? 'Editar Post' : 'Criar Post';
	const [links, setLinks] = useState<{ key: string; value: string }[]>(getInitialLinks(props.external_link));
	const [hashtags, setHashtags] = useState<{ key: string; value: string }[]>(getInitialHashtags(props.content_hashtags));
	const [imagePreview, setImagePreview] = useState<string | null>(typeof props.image === 'string' ? props.image : null);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		setForm(prev => ({
			...prev,
			...props,
			content_hashtags: props.content_hashtags ?? [],
		}));
		setImagePreview(typeof props.image === 'string' ? props.image : null);
		setLinks(getInitialLinks(props.external_link));
		setHashtags(getInitialHashtags(props.content_hashtags));
	}, [props]);

	const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	}, []);

	useEffect(() => {
		setForm(prev => ({
			...prev,
			content_hashtags: hashtags.map(h => h.value),
		}));
	}, [hashtags]);

	useEffect(() => {
		setForm(prev => ({
			...prev,
			external_link: links.reduce((acc, { key, value }) => {
				if (key && value) acc[key] = value;
				return acc;
			}, {} as Record<string, string>),
		}));
	}, [links]);

	const handleLinksChange = React.useCallback((newLinks: { key: string; value: string }[]) => setLinks(newLinks), []);
	const handleImage = React.useCallback((file: File | null) => setForm(prev => ({ ...prev, image: file })), []);
	const { handleSubmit } = useFormPostSubmit({ form, links, setErrors });

	return (
		<Box className="form-post-container">
			<Paper elevation={3} className="form-post-paper">
				<Typography variant="h4" component="h2" className="form-post-title">
					{formTitle}
				</Typography>
				<form onSubmit={handleSubmit} className="form-post-form">
					<ImageUpload
						image={form.image}
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
					<Typography variant="subtitle1" className="form-post-label">Links Externos</Typography>
					<DynamicFieldsInput
						items={links}
						onChange={handleLinksChange}
						keyLabel="Nome do link (ex: github, documentacao)"
						valueLabel="URL"
						addButtonLabel="Adicionar link"
						keyPlaceholder="github, documentacao..."
						valuePlaceholder="https://..."
						error={errors.external_link}
					/>
					<Typography variant="subtitle1" className="form-post-label">Hashtags</Typography>
					<DynamicFieldsInput
						items={hashtags}
						onChange={setHashtags}
						keyLabel="Nome da hashtag (ex: matemática, ciência)"
						valueLabel="Hashtag"
						allowKeyEdit={false}
						addButtonLabel="Adicionar hashtag"
						valuePlaceholder="#hashtag"
						error={errors.content_hashtags}
					/>
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
