BUILDROOT := $(shell [ -d "/build" ] && echo "/build" || echo ".")
TMPDIR := $(shell mktemp -d)
NPM := $(shell if which npm 2>/dev/null; then true; else echo npm; fi)

$(NPM):
	dnf install -y npm
	dnf install -y nodejs-packaging

srpm: $(NPM)
	rm -rf ${TMPDIR}
	mkdir -p ${TMPDIR}/scratch
	mkdir -p ${TMPDIR}/_topdir/SOURCES
	cp -r /build/* ${TMPDIR}/scratch
	cd ${TMPDIR}/scratch && npm i --silent && npm run postversion > "/dev/null" 2>&1 && npm pack --silent
	cp -r ${TMPDIR}/scratch/* ${TMPDIR}/_topdir/SOURCES
	rpmbuild -bs --define "_topdir ${TMPDIR}/_topdir" ${TMPDIR}/_topdir/SOURCES/iml-view-server.spec
	cp -r ${TMPDIR}/_topdir/SRPMS/* $(outdir)
