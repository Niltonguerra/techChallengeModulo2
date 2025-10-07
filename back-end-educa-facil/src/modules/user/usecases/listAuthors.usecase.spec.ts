import { systemMessage } from '@config/i18n/pt/systemMessage';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { listAuthorsParamsDTO, searchByFieldUserEnum } from '../dtos/listAuthorsParams.dto';
import { UserService } from '../service/user.service';
import { listAuthorsUseCase } from './listAuthors.usecase';

describe('listAuthorsUseCase', () => {
    let useCase: listAuthorsUseCase;
    let userService: UserService;

    const mockUserService = {
        listAuthors: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [listAuthorsUseCase, { provide: UserService, useValue: mockUserService }],
        }).compile();

        useCase = module.get<listAuthorsUseCase>(listAuthorsUseCase);
        userService = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar lista de autores com sucesso', async () => {
        const mockResponse = {
            statusCode: 200,
            message: systemMessage.ReturnMessage.successListUsers,
            data: [{ id: 1, name: 'Luis' }],
        };

        mockUserService.listAuthors.mockResolvedValue(mockResponse);

        const params: listAuthorsParamsDTO = {
            field: searchByFieldUserEnum.NAME,
            value: 'Luis',
        };

        const result = await useCase.listAuthors(params);

        expect(userService.listAuthors).toHaveBeenCalledWith('name', 'Luis');
        expect(result).toEqual(mockResponse);
    });

    it('deve lançar HttpException personalizada se ocorrer erro genérico', async () => {
        mockUserService.listAuthors.mockRejectedValue(new Error('DB down'));

        const params: listAuthorsParamsDTO = { field: undefined, value: undefined };

        await expect(useCase.listAuthors(params)).rejects.toThrow(HttpException);

        try {
            await useCase.listAuthors(params);
        } catch (error) {
            const err = error as HttpException;
            expect(err.message).toContain(systemMessage.ReturnMessage.errorUserNotFound);
            expect(err.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    });

    it('deve propagar mensagem e status se o erro for HttpException', async () => {
        const httpError = new HttpException('Custom error', HttpStatus.BAD_REQUEST);
        mockUserService.listAuthors.mockRejectedValue(httpError);

        const params: listAuthorsParamsDTO = {
            field: searchByFieldUserEnum.ID,
            value: '999',
        };

        await expect(useCase.listAuthors(params)).rejects.toThrow(HttpException);

        try {
            await useCase.listAuthors(params);
        } catch (error) {
            const err = error as HttpException;
            expect(err.message).toContain('Custom error');
            expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
    });
});
