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
import { Message } from './message';

/**
 * An off-chain request used for:
 *
 * 1. Requesting a verifiable claim
 * 2. Proving identity (ownership of ONT ID)
 */
export class Request extends Message {
    static deserialize(jwt: string): Request {
        return super.deserializeInternal(jwt, (m: any, s: any) => new Request(m, s));
    }

    data?: any;

    protected payloadToJSON(): any {
        return {
            data: this.data
        };
    }

    protected payloadFromJSON(json: any): void {
        this.data = json.data;
    }
}
