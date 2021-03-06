/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Log, SetOptions} from '../../logging';
import {WriteDeclarations} from '../../transform/transform';
import {load} from '../../triples/reader';
import {Context} from '../../ts/context';

import {IsCustom, ParseFlags} from '../args';

export async function main(args?: string[]) {
  const options = ParseFlags(args);
  SetOptions(options);

  const ontologyUrl = IsCustom(options)
    ? options.ontology
    : `https://schema.org/version/${options.schema}/${options.layer}.nt`;
  Log(`Loading Ontology from URL: ${ontologyUrl}`);

  const result = load(ontologyUrl);
  const context = Context.Parse(options.context);
  await WriteDeclarations(result, options.deprecated, context, write);
}

function write(content: string) {
  process.stdout.write(content, 'utf-8');
}
