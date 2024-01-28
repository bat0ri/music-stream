

proto-gen-web: clear
<<<<<<<<< Temporary merge branch 1
	protoc -I=. src/proto/hello.proto \
	--plugin=protoc-gen-js=./node_modules/.bin/protoc-gen-js \
	--js_out=import_style=commonjs:. \
	--grpc-web_out=import_style=commonjs,mode=grpcwebtext:.

proto-gen-web-ts: clear
	protoc -I=. src/proto/hello.proto \
=========
	protoc -I=../protos/ ../protos/*.proto \
	--plugin=protoc-gen-js=./node_modules/.bin/protoc-gen-js \
	--js_out=import_style=commonjs:./src/generated \
	--grpc-web_out=import_style=commonjs,mode=grpcwebtext:./src/generated

proto-gen-web-ts: clear
	protoc -I=. src/proto/*.proto \
>>>>>>>>> Temporary merge branch 2
	--plugin=protoc-gen-ts=node_modules/.bin/protoc-gen-ts \
	--ts_out=service=grpc-web:. \
	--plugin=protoc-gen-js=./node_modules/.bin/protoc-gen-js \
	--js_out=import_style=commonjs,binary:. \
	--grpc-web_out=import_style=typescript,mode=grpcwebtext:.

clear:
	rm -rf src/proto/*.ts src/proto/*.js

webpack:
	rm -rf dist/
	npx webpack --mode=development ./src/client.js --output-filename=corsing.js



