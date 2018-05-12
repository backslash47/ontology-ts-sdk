/*
 * Copyright (C) 2018 The ontology Authors
 * This file is part of The ontology library.
 *
 * The ontology is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The ontology is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The ontology.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Request } from '../src/request';
import { PrivateKey, Signature, KeyType } from '../src/crypto';

describe('test request', () => {
    const restUrl = 'http://polaris1.ont.io:20334';
    const publicKeyId = 'did:ont:TGpoKGo26xmnA1imgLwLvYH2nhWnN62G9w#keys-1';
    const privateKey = new PrivateKey('eaec4e682c93648d24e198da5ef9a9252abd5355c568cd74fba59f98c0b1a8f4');

    test('test serialization', () => {
        const request = new Request({
            messageId: '1',
            issuer: 'did:ont:TGpoKGo26xmnA1imgLwLvYH2nhWnN62G9w',
            subject: 'did:ont:TGpoKGo26xmnA1imgLwLvYH2nhWnN62G9w',
            issuedAt: 1525800823
        }, undefined);

        request.data = {
            email: 'request@email.com'
        };

        expect(request.serialize()).toEqual('eyJ0eXAiOiJKV1QifQ.eyJqdGkiOiIxIiwiaXNzIjoiZGlkOm9udDpUR3' +
                                            'BvS0dvMjZ4bW5BMWltZ0x3THZZSDJuaFduTjYyRzl3Iiwic3ViIjoiZGl' +
                                            'kOm9udDpUR3BvS0dvMjZ4bW5BMWltZ0x3THZZSDJuaFduTjYyRzl3Iiwi' +
                                            'aWF0IjoxNTI1ODAwODIzLCJkYXRhIjp7ImVtYWlsIjoicmVxdWVzdEBlb' +
                                            'WFpbC5jb20ifX0');
    });

    test('test deserialization', async () => {
        const serialized = 'eyJ0eXAiOiJKV1QifQ.eyJqdGkiOiIxIiwiaXNzIjoiZGlkOm9udDpUR3' +
            'BvS0dvMjZ4bW5BMWltZ0x3THZZSDJuaFduTjYyRzl3Iiwic3ViIjoiZGl' +
            'kOm9udDpUR3BvS0dvMjZ4bW5BMWltZ0x3THZZSDJuaFduTjYyRzl3Iiwi' +
            'aWF0IjoxNTI1ODAwODIzLCJkYXRhIjp7ImVtYWlsIjoicmVxdWVzdEBlb' +
            'WFpbC5jb20ifX0';

        const request = Request.deserialize(serialized);

        expect(request.metadata.messageId).toEqual('1');
        expect(request.metadata.issuer).toEqual('did:ont:TGpoKGo26xmnA1imgLwLvYH2nhWnN62G9w');
        expect(request.metadata.subject).toEqual('did:ont:TGpoKGo26xmnA1imgLwLvYH2nhWnN62G9w');
        expect(request.metadata.issuedAt).toEqual(1525800823);
        expect(request.signature).toBeUndefined();
        expect(request.data.email).toEqual('request@email.com');
    });

    test('test signature', async () => {
        const request = new Request({
            messageId: '1',
            issuer: 'did:ont:TGpoKGo26xmnA1imgLwLvYH2nhWnN62G9w',
            subject: 'did:ont:TGpoKGo26xmnA1imgLwLvYH2nhWnN62G9w',
            issuedAt: 1525800823
        }, undefined);
        request.data = {
            email: 'request@email.com'
        };

        await request.sign(restUrl, publicKeyId, privateKey);

        expect(request.serialize()).toEqual('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDpvbnQ6V' +
                                            'Edwb0tHbzI2eG1uQTFpbWdMd0x2WUgybmhXbk42Mkc5dyNrZXlzLTEifQ' +
                                            '.eyJqdGkiOiIxIiwiaXNzIjoiZGlkOm9udDpUR3BvS0dvMjZ4bW5BMWlt' +
                                            'Z0x3THZZSDJuaFduTjYyRzl3Iiwic3ViIjoiZGlkOm9udDpUR3BvS0dvM' +
                                            'jZ4bW5BMWltZ0x3THZZSDJuaFduTjYyRzl3IiwiaWF0IjoxNTI1ODAwOD' +
                                            'IzLCJkYXRhIjp7ImVtYWlsIjoicmVxdWVzdEBlbWFpbC5jb20ifX0.yY-' +
                                            'Wun7JdJ1Sh5phXbWIwG50Flu_C_76agaOqEgY7eFHe4lxHLVX92gOnOms' +
                                            'yq1cN_MBLSsJei9ZnhaIE6jPEA');
    });

    test('test verify', async () => {
        const serialized = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDpvbnQ6V' +
            'Edwb0tHbzI2eG1uQTFpbWdMd0x2WUgybmhXbk42Mkc5dyNrZXlzLTEifQ' +
            '.eyJqdGkiOiIxIiwiaXNzIjoiZGlkOm9udDpUR3BvS0dvMjZ4bW5BMWlt' +
            'Z0x3THZZSDJuaFduTjYyRzl3Iiwic3ViIjoiZGlkOm9udDpUR3BvS0dvM' +
            'jZ4bW5BMWltZ0x3THZZSDJuaFduTjYyRzl3IiwiaWF0IjoxNTI1ODAwOD' +
            'IzLCJkYXRhIjp7ImVtYWlsIjoicmVxdWVzdEBlbWFpbC5jb20ifX0.yY-' +
            'Wun7JdJ1Sh5phXbWIwG50Flu_C_76agaOqEgY7eFHe4lxHLVX92gOnOms' +
            'yq1cN_MBLSsJei9ZnhaIE6jPEA';

        const request = Request.deserialize(serialized);

        const result = await request.verify(restUrl);

        expect(result).toBeTruthy();
    });
});
