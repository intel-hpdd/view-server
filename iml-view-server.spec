%define base_name view-server

Name:       iml-%{base_name}
Version:    8.0.5
# Release Start
Release:    1%{?dist}
# Release End
Summary:    Serves the HTML pages for the IML GUI.
License:    MIT
Group:      System Environment/Libraries
URL:        https://github.com/whamcloud/%{base_name}
Source0:    %{name}-%{version}.tgz

%{?systemd_requires}
BuildRequires: systemd

BuildRequires: nodejs-packaging
BuildArch: noarch

%description
This module serves the HTML + cached API JSON for the GUI.

%prep
%setup -q -n package

%build
#nothing to do

%install
mkdir -p %{buildroot}%{_unitdir}
mkdir -p %{buildroot}%{nodejs_sitelib}/@iml/%{base_name}/targetdir
cp iml-view-server.service %{buildroot}%{_unitdir}
cp -al targetdir/. %{buildroot}%{nodejs_sitelib}/@iml/%{base_name}/targetdir
cp -p package.json %{buildroot}%{nodejs_sitelib}/@iml/%{base_name}

%post
systemctl preset iml-view-server.service

%preun
%systemd_preun iml-view-server.service

%postun
%systemd_postun_with_restart iml-view-server.service

%clean
rm -rf %{buildroot}

%files
%{nodejs_sitelib}
%attr(0644,root,root)%{_unitdir}/iml-view-server.service

%changelog
* Mon Jan 14 2019 Will Johnson <wjohnson@whamcloud.com> - 8.0.4-1
- Install deps before running postversion

* Mon Jan 14 2019 Will Johnson <wjohnson@whamcloud.com> - 8.0.3-1
- Build using Docker copr image

* Tue Jun 19 2018 Joe Grund <jgrund@whamcloud.com> - 8.0.0-1
- Build using FAKE
- Initial standalone RPM package
