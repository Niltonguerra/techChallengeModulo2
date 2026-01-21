import { useEffect, useState } from 'react';
import { Box, Stack, Typography, CircularProgress, Button } from '@mui/material';
import type  { DropdownOption } from '../../types/dropdown';
import { getSchoolSubjectsDropdown } from '../../service/schoolSubject';
import { Dropdown } from '../../components/Dropdown/Dropdown';

// TODO: PAGINA SOMENTE DE TESTE DEPOIS DELETAR
export function DropdownPlayground() {
  const [filterType, setFilterType] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectsOptions, setSubjectsOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(false);

  const filterOptions: DropdownOption[] = [
    {
      label: 'Listar todas as dúvidas sem responsável',
      value: 'UNASSIGNED',
    },
    {
      label: 'Listar apenas dúvidas atribuídas a mim',
      value: 'MINE',
    },
  ];

  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoading(true);
        const data = await getSchoolSubjectsDropdown();
        setSubjectsOptions(data);
      } catch (error) {
        console.error('Erro ao carregar matérias', error);
      } finally {
        setLoading(false);
      }
    }

    loadSubjects();
  }, []);

  const handleClearFilters = () => {
    setFilterType('');
    setSubject('');
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>
        Playground – Filtros de Dúvidas
      </Typography>

      <Stack spacing={3} maxWidth={420}>
        <Dropdown
          label="Filtro de dúvidas"
          value={filterType}
          options={filterOptions}
          onChange={setFilterType}
        />

        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Dropdown
            label="Matéria"
            value={subject}
            options={subjectsOptions}
            onChange={setSubject}
          />
        )}

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClearFilters}
          disabled={!filterType && !subject}
        >
          Limpar filtros
        </Button>
      </Stack>

      <Box mt={4}>
        <Typography variant="subtitle1">
          Estado atual:
        </Typography>

        <pre>
          {JSON.stringify(
            {
              filterType,
              subject,
            },
            null,
            2,
          )}
        </pre>
      </Box>
    </Box>
  );
}